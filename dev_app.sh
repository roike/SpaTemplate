#!/bin/bash
# project: SpaTemplate
#dev_appserver.py --enable_sendmail=yes --datastore_path=/GoogleDrive/gaestorage/elabo-two dispatch.yaml app.yaml task.yaml
dev_appserver.py --enable_sendmail=yes dispatch.yaml app.yaml task.yaml
#dev_appserver.py --enable_sendmail=yes --port=8080 app.yaml
