/*
 * (C) Copyright 2010-2011 Nuxeo SAS (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     Nuxeo - initial API and implementation
 */

package org.nuxeo.ecm.mobile.resource;


import org.nuxeo.ecm.mobile.Constants;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;

@Path(Constants.ROOT + "/s")
public class StaticResource {

    @GET
    public Object getRoot() throws IOException {
        return get("/");
    }

    @GET
    @Path("{path:.*}")
    public Object get(@PathParam("path") String path) throws IOException {
        System.out.println(path);
        if (path.endsWith("/")) {
            path += "index.html";
        }
        InputStream stream = StaticResource.class.getResourceAsStream("/www/" + path);
        String mimeType;
        if (path.endsWith(".html")) {
            mimeType = "text/html";
        } else if (path.endsWith(".js")) {
            mimeType = "application/javascript";
        } else if (path.endsWith(".css")) {
            mimeType = "text/css";
        } else if (path.endsWith(".png")) {
            mimeType = "image/png";
        } else if (path.endsWith(".gif")) {
            mimeType = "image/gif";
        } else {
            throw new IllegalStateException("Can't find mime type for: " + path);
        }
        System.out.println(mimeType);
        return Response.ok(stream).type(mimeType).build();
    }

}
