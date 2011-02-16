	TOMCAT=$(HOME)/apps/nuxeo-dm-tomcat
	JAR=nuxeo-mobile-web-*SNAPSHOT.jar

.PHONY: all check deploy clean start build deploy test stop

all: build

test:
	mvn $(MVN_OPT) clean test

build:
	coffee -c .
	mvn $(MVN_OPT) clean install -Dmaven.test.skip=true

deploy: build
	cp target/$(JAR) $(TOMCAT)/nxserver/plugins

run:
	$(TOMCAT)/bin/nuxeoctl console

start:
	$(TOMCAT)/bin/nuxeoctl start

stop:
	$(TOMCAT)/bin/nuxeoctl stop

run-embedded:
	mvn test-compile ; ./run.sh

brew:
	coffee -cw src/main/resources/www/bm/*.coffee 

clean:
	rm -rf nohup.out bin target data *.log projectFilesBackup zip
	rm -f *.pyc
	find . -name "*~" | xargs rm -f

superclean: clean
	mvn dependency:purge-local-repository

autocompile:
	coffee -wc .
