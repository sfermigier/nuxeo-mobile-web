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

import java.util.List;
import java.util.Map;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import org.json.simple.JSONValue;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Simple test using the Jersey HTTP client.
 * Only standard HTTP methods are supported, so we're only testing GET, PUT and DELETE.
 */
public class JerseyClientTest extends AbstractServerTest {

	public Client client;
	public WebResource api;
	
	@Before
	public void setUp() {
        client = Client.create();
        api = client.resource(API_ROOT_URI);		
	}

    @Test
    public void webTest() {
        WebResource r = client.resource(WEB_ROOT_URI);

        String e1 = r.path("").get(String.class);
        assertTrue(e1.length() > 0);
    }

    @Test
    public void testUpdates() {
        String e = api.path("updates").get(String.class);
        assertTrue(e.length() > 0);
        Object o = JSONValue.parse(e);
        assertTrue(o instanceof List);
    }
        
    @Test
    public void testSearch() {
        String e = api.path("search").queryParam("q", "").get(String.class);
        assertTrue(e.length() > 0);
        Object o = JSONValue.parse(e);
        assertTrue(o instanceof List);
    }

    @SuppressWarnings("rawtypes")
	@Test
    public void testRoot() {
        String e = api.path("info/").get(String.class);
        System.out.println(e);
        assertTrue(e.length() > 0);
        Object o = JSONValue.parse(e);
        assertTrue(o instanceof Map);
        Map m = (Map) o;
        assertEquals("Root", m.get("title"));        
        assertEquals("/", m.get("path"));        
    }

}
