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

import org.junit.AfterClass;
import org.junit.BeforeClass;

public abstract class AbstractServerTest {

    static final int PORT = 9999;

    static final String ROOT_URI = "http://localhost:" + PORT + Constants.HOME;

    @BeforeClass
    public static void startServer() throws Exception {
        // After a "mvn clean" we need to start the runtime twice.
        try {
            Server.startRuntime();
        } catch (Exception e) {
            Server.startRuntime();
        }
        Server.startServer(PORT);
    }

    @AfterClass
    public static void stopServer() {
        Server.stopServer();
    }

}
