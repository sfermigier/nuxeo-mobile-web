About
=====

This is a prototype Nuxeo mobile client using JAX-RS and various mobile JavaScript frameworks.


Building / Running
------------------

Type: "make run-embedded". This builds and starts an embedded server with a demo
repository (you may need to do it twice if it fails the first time).

You can also start the embedded server from your IDE (Eclipse or IDEA).

To deploy to a JBoss or Tomcat Nuxeo distribution, edit the Makefile to enter
the proper location of your Nuxeo server, then "make deploy" (assumes you have
your development server in $HOME/apps/nuxeo-dm-tomcat).

If you want to debug on Tomcat, you may want to change the priority for
category "org.nuxeo" to DEBUG in the lib/log4j.xml file in the Nuxeo server
distribution.


Testing the embedded server
---------------------------

Type "run.sh" then point your (mobile) browser to http://localhost:9998/

NB: your must use a modern HTML5 browser.


Testing the tomcat or jboss server
----------------------------------

Start the Nuxeo server, then point your browser to http://localhost:8080/nuxeo/site/m
