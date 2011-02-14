package org.nuxeo.ecm.mobile.resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONValue;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.mobile.Constants;
import org.nuxeo.ecm.mobile.Util;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.*;

/**
 * JSON-RPC endpoint for the mobile API.
 */
@Path(Constants.ROOT + "/j")
@Produces({"application/json"})
public class JsonResource {

    private static final Log log = LogFactory.getLog(JsonResource.class);
    private static String rootPath;

    private final CoreSession session;

    public JsonResource(@Context HttpServletRequest request) throws Exception {
        log.info(request.getMethod() + " " + request.getRequestURI());

        session = Util.getSession(request);
        if (rootPath == null) {
            rootPath = request.getContextPath() + request.getServletPath();
            log.info("Root path = " + rootPath);
        }
    }

    public JsonResource(CoreSession session) {
        this.session = session;
    }

    /**
     * Gets info (as JSON) on an object given its OID.
     */
    @GET
    @Path("i/{oid:.*}")
    public Object info(@PathParam("oid") String oid) throws ClientException {
        DocumentRef ref;
        if (oid == null || oid.isEmpty()) {
            ref = new PathRef("/");
        } else {
            ref = new IdRef(oid);
        }
        DocumentModel doc = session.getDocument(ref);
        Map<String, Object> model = makeModel(doc);
        if (doc.isFolder()) {
            model.put("children", makeDocListModel(session.getChildren(doc.getRef())));
        }
        return JSONValue.toJSONString(model);
    }

    /**
     * Downloads an object given its OID.
     */
    @GET
    @Path("d/{oid:.*}")
    public Object download(@PathParam("oid") String oid) throws ClientException, IOException {
        DocumentRef ref = new IdRef(oid);
        DocumentModel doc = session.getDocument(ref);
        if (doc.getType().equals("Note")) {
            String note = (String) doc.getPropertyValue("note:note");
            String mimetype = (String) doc.getPropertyValue("note:mime_type");
            return Response.ok(note).type(mimetype).build();
        }

        Blob content = getBlob(doc);
        if (content == null) {
            return Response.ok("Empty document.").build();
        } else {
            return Response.ok(content.getStream()).type(content.getMimeType()).build();
        }
    }

    @GET
    @Path("updates")
    public Object updates() throws Exception {
        DocumentModelList result = session.query(
                "SELECT * FROM Document "
                + "WHERE ecm:currentLifeCycleState <> 'deleted' "
                + "AND ecm:primaryType <> 'Folder' "
                + "AND ecm:primaryType <> 'Workspace' "
                + "ORDER BY dc:modified DESC", 100);
        Collection<Map<String, Object>> model = makeDocListModel(result);
        return JSONValue.toJSONString(model);
    }

    @GET
    @Path("search")
    public Object search(@QueryParam("q") String query) throws Exception {
        query = query.replace("'", " ");
        String select =
                "SELECT * FROM Document WHERE ecm:fulltext LIKE '%" + query + "%' LIMIT 10";
        DocumentModelList result = session.query(select);
        Collection<Map<String, Object>> model = makeDocListModel(result);
        return JSONValue.toJSONString(model);
    }

    // Utility functions

    Collection<Map<String, Object>> makeDocListModel(Iterable<DocumentModel> modelList) throws ClientException {
        Collection<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        if (modelList != null) {
            for (DocumentModel childModel : modelList) {
                if (!childModel.isFolder() && !hasBlob(childModel)
                        && !childModel.getType().equals("Note")) {
                    continue;
                }
                Map<String, Object> child = makeModel(childModel);
                result.add(child);
            }
        }
        return result;
    }

    Map<String, Object> makeModel(DocumentModel doc) throws ClientException {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("oid", doc.getId());
        model.put("title", doc.getTitle());
        model.put("name", doc.getName() + (doc.isFolder() ? "/" : ""));
        model.put("path", doc.getPathAsString());
        model.put("isfolder", doc.isFolder());
        DataModel dublinCore = doc.getDataModel("dublincore");
        for (Map.Entry<String, Object> entry : dublinCore.getMap().entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value == null) {
                // Optimize payload
                continue;
            }
            if (value instanceof Calendar) {
                model.put(key, ((Calendar) value).getTimeInMillis() / 1000);
            } else if (value instanceof String[]) {
                model.put(key, Arrays.asList((String[]) value));
            } else {
                model.put(key, value);
            }
        }
        if (doc.isFolder()) {
            model.put("childcount", session.getChildren(doc.getRef()).size());
        } else {
            model.put("mimetype", getMimeType(doc));
            model.put("size", getSize(doc));
        }
        Calendar modified = (Calendar) doc.getPropertyValue("dc:modified");
        Calendar created = (Calendar) doc.getPropertyValue("dc:created");
        if (modified != null) {
            model.put("modified", modified.getTimeInMillis() / 1000);
        } else {
            model.put("modified", "???");
        }
        if (created != null) {
            model.put("created", created.getTimeInMillis() / 1000);
        } else {
            model.put("created", "???");
        }
        return model;
    }

    private static long getSize(DocumentModel doc) {
        Blob blob = getBlob(doc);
        if (blob != null) {
            return blob.getLength();
        }
        if (doc.getType().equals("Note")) {
            try {
                String note = (String) doc.getPropertyValue("note:note");
                return note.length();
            } catch (Exception e) {
            }
        }
        return 0;
    }

    private static String getMimeType(DocumentModel doc) {
        Blob blob = getBlob(doc);
        if (blob != null) {
            return blob.getMimeType();
        }
        if (doc.getType().equals("Note")) {
            try {
                return (String) doc.getPropertyValue("note:mime_type");
            } catch (Exception e) {
            }
        }
        return null;
    }

    private static boolean hasBlob(DocumentModel doc) {
        try {
            Property prop = doc.getProperty("file:content");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static Blob getBlob(DocumentModel doc) {
        try {
            return (Blob) doc.getPropertyValue("file:content");
        } catch (Exception e) {
            return null;
        }
    }

}
