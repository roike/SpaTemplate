#!/bin/bash
#dev_appserver.py --enable_sendmail=yes --datastore_path=/Users/ryuji/GoogleDrive/gaestorage/elabo-two dispatch.yaml app.yaml thirdpen.yaml
dev_appserver.py --enable_sendmail=yes dispatch.yaml app.yaml task.yaml
