/*
 * (C) Copyright 2006-2009 Nuxeo SAS (http://nuxeo.com/) and contributors.
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
 *
 * $Id$
 */

package org.nuxeo.ecm.mobile;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.core.UriBuilder;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.ecm.core.api.repository.Repository;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;

import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.NXRuntimeTestCase;

import com.sun.grizzly.http.embed.GrizzlyWebServer;
import com.sun.grizzly.http.servlet.ServletAdapter;
import com.sun.jersey.spi.container.servlet.ServletContainer;

import static org.nuxeo.ecm.mobile.Constants.BUNDLE_NAME;
import static org.nuxeo.ecm.mobile.Constants.TEST_BUNDLE_NAME;

/**
 * Starts up an embedded server with the Nuxeo services.
 */
public class Server {

    static boolean DEBUG = false;

    // Constants: TODO externalize them to a property file.
    static String BASE_URI = "http://localhost/";
    static int PORT = 9998;

    private static NXRuntimeTestCase osgi;
    private static GrizzlyWebServer gws;

    private Server() {
    }

    public static void main(String[] args) throws Exception {
        long start = System.currentTimeMillis();
        startRuntime();
        System.out.println("Runtime started in "
                + (System.currentTimeMillis() - start) + " ms");

        System.out.println("Starting grizzly...");
        startServer(PORT);
        System.out.println(String.format(
                "Jersey app started with WADL available at "
                        + "%sapplication.wadl\nHit Ctrl-C to stop it...",
                UriBuilder.fromUri(BASE_URI).port(PORT).build()));
        try {
            Thread.sleep(Long.MAX_VALUE);
        } finally {
            System.out.println("Stopping grizzly...");
            stopServer();
        }
    }

    public static void startRuntime() throws Exception {
        osgi = new NXRuntimeTestCase();
        osgi.setUp();

        // deploy core bundles
        osgi.deployBundle("org.nuxeo.ecm.core.api");
        osgi.deployBundle("org.nuxeo.ecm.core.event");
        osgi.deployBundle("org.nuxeo.ecm.core");
        osgi.deployBundle("org.nuxeo.ecm.core.storage.sql");
        osgi.deployBundle("org.nuxeo.ecm.core.schema");

        // deploy platform bundles
        osgi.deployBundle("org.nuxeo.ecm.platform.dublincore");

        // deploy this project's bundles + contribs
        osgi.deployBundle(BUNDLE_NAME);

        osgi.deployContrib(TEST_BUNDLE_NAME,
                "config/default-repository-config.xml");
        osgi.deployContrib(TEST_BUNDLE_NAME,
                "config/platform-config.xml");

        setupTestRepo();

        osgi.deployContrib(TEST_BUNDLE_NAME,
                "config/authentication-config.xml");
        osgi.deployContrib(TEST_BUNDLE_NAME,
                "config/login-config.xml");
    }

    public static void startServer(int port) throws IOException {
        // static content is linked from here
        String path = "src/main/resources/www";

        gws = new GrizzlyWebServer(port, path);

        ServletAdapter jerseyAdapter = new ServletAdapter();
        // Using the portable way of registering JAX-RS resources.
        jerseyAdapter.addInitParameter("javax.ws.rs.Application",
                Application.class.getCanonicalName());
        jerseyAdapter.addRootFolder(path);
        jerseyAdapter.setHandleStaticResources(true);
        jerseyAdapter.setServletInstance(new ServletContainer());
        jerseyAdapter.setContextPath("");

        if (DEBUG) {
            jerseyAdapter.addInitParameter("com.sun.jersey.spi.container.ContainerRequestFilters",
                "com.sun.jersey.api.container.filter.LoggingFilter");
            jerseyAdapter.addInitParameter("com.sun.jersey.spi.container.ContainerResponseFilters",
                "com.sun.jersey.api.container.filter.LoggingFilter");
        }
        jerseyAdapter.addInitParameter("com.sun.jersey.config.feature.logging.DisableEntitylogging", "true");

        gws.addGrizzlyAdapter(jerseyAdapter, new String[] { "" });

        // let Grizzly run
        gws.start();
    }

    public static void stopServer() {
        gws.stop();
    }

    /**
     * Create some content in the repository for testing purposes.
     */
    private static void setupTestRepo() throws Exception {
        RepositoryManager rm = Framework.getService(RepositoryManager.class);
        Repository repo = rm.getDefaultRepository();
        CoreSession session = repo.open();

        session.removeChildren(new PathRef("/"));

        createFolder("/", "Workspaces", session);
        for (int i=0; i<4; i++) {
            createFolder("/", "Another Folder " + i, session);
        }

        createFile("quality.jpg", "image/jpg", session);
        createFile("test.html", "text/html", session);
        createFile("test.txt", "text/plain", session);
        createFile("nxdoc.pdf", "application/pdf", session);

        createNote("note.txt", session);
        session.save();
    }

    private static void createFolder(String parent, String name, CoreSession session) throws ClientException {
        DocumentModel ws = session.createDocumentModel(parent, name.toLowerCase(), "Workspace");
        ws.setPropertyValue("dublincore:title", name);
        session.createDocument(ws);
    }

    private static void createFile(String name, String mimeType, CoreSession session) throws Exception {
        DocumentModel file = session.createDocumentModel("/workspaces", name, "File");
        file.setProperty("dublincore", "title", name);
        String testDocsPath = Thread.currentThread().getContextClassLoader().getResource("testdocs").getPath();
        Blob fb = new FileBlob(new File(testDocsPath + "/" + name));
        fb.setMimeType(mimeType);
        file.setProperty("file", "content", fb);
        session.createDocument(file);
    }

    private static void createNote(String name, CoreSession session) throws Exception {
        DocumentModel file = session.createDocumentModel("/workspaces", name, "Note");
        file.setProperty("dublincore", "title", name);
        file.setProperty("note", "note", "Some random content.");
        file.setProperty("note", "mime_type", "text/plain");
        session.createDocument(file);
    }

}
