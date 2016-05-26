#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright 2016 ryuji.oike@gmail.com
# Released under the MIT license
# http://opensource.org/licenses/mit-license.php
#--日本語--
import os

APP_ROOT_DIR = os.path.abspath(os.path.dirname(__file__))

SETTINGS = {
    'title': 'ThirdPen',
    'description': "Google App Engine-Based Plathome",
    'author': 'ryuji.oike@gmail.com',
    'email': 'ryuji.oike@gmail.com ',
    'url': 'https://third-pen.appspot.com',
    'mail_to': 'third-pen.appspotmail.com',
    'items_per_page': 10,
    # Google Cloud Strage 設定
    'gs_bucket_images': 'blog_pen1',
    # Enable/disable Google Analytics
    # Set to your tracking code (UA-xxxxxx-x), or False to disable
    'google_analytics': False,
    # Enable/disable Disqus-based commenting for posts
    # メール送信先設定(複数選択時はカンマ区切り)
    'mail_to_error': 'ryuji.oike@gmail.com',
    'mail_to_complete': 'ryuji.oike@gmail.com',
    'mail_to_warning': 'ryuji.oike@gmail.com',
    'mail_from': 'ryuji.oike@gmail.com'
}
