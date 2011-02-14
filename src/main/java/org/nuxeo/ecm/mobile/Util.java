/*
 * (C) Copyright 2006-2011 Nuxeo SAS (http://nuxeo.com/) and contributors.
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

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.repository.Repository;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.webengine.session.UserSession;
import org.nuxeo.runtime.api.Framework;

import javax.servlet.http.HttpServletRequest;


/**
 * Utility functions.
 */
public class Util {

    // Utility class.
    private Util() {
    }

    /**
     * Gets a core session using a mechanism specific to WebEngine.
     */
    public static CoreSession getSession(HttpServletRequest request) throws Exception {
        UserSession userSession = UserSession.getCurrentSession(request);
        if (userSession != null) {
            return userSession.getCoreSession();
        } else {
            return getSession();
        }
    }

    /**
     * Gets a core session directly from the RepositoryManager.
     * Used for the test server.
     */
    public static CoreSession getSession() throws Exception {
        RepositoryManager rm = Framework.getService(RepositoryManager.class);
        Repository repo = rm.getDefaultRepository();
        return repo.open();
    }

}
