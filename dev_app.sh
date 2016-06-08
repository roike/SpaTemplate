#!/bin/bash
# project: SpaTemplate
#dev_appserver.py --enable_sendmail=yes --datastore_path=/Users/ryuji/GoogleDrive/gaestorage/elabo-two dispatch.yaml app.yaml thirdpen.yaml
#dev_appserver.py --enable_sendmail=yes dispatch.yaml app.yaml task.yaml
dev_appserver.py --enable_sendmail=yes --port=8080 app.yaml
