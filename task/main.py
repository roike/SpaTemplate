#!/usr/bin/env python
# -*- coding: utf-8 -*-
# spa template on GAE
# task.main Copyright 2016 ryuji.oike@gmail.com
from google.appengine.api import mail, modules
from bottle import Bottle, debug, request
import logging
#localモジュール---------------------------------

#mailの送信はtaskQueue経由でモジュールから送るため
#Email API Authorized Sendersに,権限ある送信者のリストが必要
#MAIL_SENDER = 'youraccount@gmail.com'
MAIL_SENDER = 'ryuji.oike@gmail.com'

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
        name = request.forms.get('name')
        mail.send_mail(
                'from',
                'user_address',
                'subject',
                'body'
                )

    elif anchor == 'contact':
        try:
            name = request.forms.get('name')
            email = request.forms.get('email')
            note = request.forms.get('note')
            sender = MAIL_SENDER
            logging.info('%s,%s,%s,%s' % (name, email, note, sender))
            mail.send_mail(sender, email, name, note)
        except Exception as e:
            logging.error(e)

