/*
 * (C) Copyright 2010 Nuxeo SAS (http://nuxeo.com/) and contributors.
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

package org.nuxeo.ecm.mobile;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

/**
 * Simple test using the Jersey HTTP client.
 * Only standard HTTP methods are supported, so we're only testing GET, PUT and DELETE.
 */
public class JerseyClientTest extends AbstractServerTest {

    @Test
    public void simpleTest() {
        Client client = Client.create();
        WebResource r = client.resource(ROOT_URI);

        String e1 = r.path("").get(String.class);
        assertTrue(e1.length() > 0);

        String e2 = r.path("r/").get(String.class);
        assertTrue(e2.length() > 0);
        assertTrue(e2.contains("Folder"));

        String e3 = r.path("search").get(String.class);
        assertTrue(e3.length() > 0);

        String e4 = r.path("timeline").get(String.class);
        assertTrue(e4.length() > 0);
        assertTrue(e4.contains("quality.jpg"));
    }

}
