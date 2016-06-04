#!/usr/bin/env python
# -*- coding: utf-8 -*-
# spa template on GAE
# task.main Copyright 2016 ryuji.oike@gmail.com
from google.appengine.api import channel, mail, modules
from bottle import Bottle, debug, request
from json import dumps
import logging, time
#localモジュール---------------------------------


bottle = Bottle()
debug(True)

#GAEのmodule起動チェック/_ah/startのhandler
@bottle.route('/_ah/start')
def start_handler():
    who = modules.get_current_module_name() 
    logging.info("Hello from the '%s' module" %  who)

@bottle.route('/task/mail/<anchor>', method='post')
def send_mail(anchor):
     #loginモニター通知
    if anchor == 'login':
        name = self.request.get('name')
        mail.send_mail(
                'from', #実際の送信元におきかえ
                'user_address', #実際の送信先に置き換え
                'subject', #実際の件名に置き換え
                'body' #実際の本文に置き換え
                )

