#!/usr/bin/env python
# -*- coding: utf-8 -*-
# spa template on GAE
# main Copyright 2016 ryuji.oike@gmail.com
from google.appengine.api import users, taskqueue
from bottle import Bottle, debug, request, response, static_file
from json import loads
import logging
#localモジュール---------------------------------

bottle = Bottle()
debug(True)

#選択可能なanchorを設定する
ALLOW_ANCHOR = ['login', 'home','newist', 'contact', 'test']

#---static_file section--------------------------------
#urlを直接入力する場合(bookmarkも同じ)もここに入る
#anchorがあればログインチェック後に指定anchorを表示
#anchorがなければtemplateでページ不在を知らせる<--未実装
@bottle.route('/')
@bottle.route('/<anchor>')
@bottle.route('/<anchor>/<abcd>')
def init_anchor(anchor='home', abcd=None):
    if anchor in ALLOW_ANCHOR:
        return static_file('pen.html', root='./')

    #templateで出力する
    return 'Sorry, Nothing at this URL.'

#-------decorator section-------------------------
def allow_cors(func):
    def wrapper(*args, **kwargs):

        print "this is a decorator which enable CORS for specified endpoint."

        #Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT '
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        return func(*args, **kwargs)

    return wrapper

def allow_login(func):
    #なりすましの場合はここでフィルターされる
    def wrapper(*args, **kwargs):
        login_user = users.get_current_user()
        request_user = request.forms.get('user_id')
        if login_user is None or request_user != login_user.nickname():
            anchor = '/' + '/'.join(loads(request.forms.get('page')))
            return ensured_login(anchor)
        return func(*args, **kwargs)
    return wrapper

#---dynamic module section---------------------
#staticファイルをダウンロード-->ログインチェック-->
#未ログイン-->login誘導-->staticファイルDW-->ログインチェック-->
#ログイン済み-->指定ページ開く
#ログイン後のデータ要求時のチェックは以下--->
#ログイン時にユーザニックネイムを発行
#以後のデータ要求時にユーザニックネイムをクライアント側とサーバ側で照合
#上記不一致の場合は未ログイン状態に初期化してフロントに戻す
#exceptが発生した場合は-------------------->
#例外をreturnすればjs.spa.modelでcatchする
#except Exception as e: return e
@bottle.route('/login', method='post')
def user_login():
    anchor = '/' + '/'.join(loads(request.forms.get('page')))
    return ensured_login(anchor)

@bottle.route('/test/publish', method='post')
@allow_login
def publish():
    res = { 'publish': {
        'content': u'リクエストを取得しました。',
        'entry': u'publish',
        'title': u'データの取得'}
        }
    res.update({ 'user_id': users.get_current_user().nickname()})

    return res

@bottle.route('/test/identify', method='post')
def identify():
    user = users.get_current_user()
    anchor = '/test/identify2'
    values = { 'id': 'a0', 'name': 'a0', 'anchor': anchor, 'login_url': None }
    values['login_url'] = users.create_login_url(anchor)
    
    logging.info(values)
    return values

@bottle.route('/test/identify2', method='post')
@allow_login
def identify2():
    res = { 'publish': {
        'content': u'ログイン確認後にリクエストされたページを表示しました。',
        'entry': u'identify',
        'title': u'ユーザチェック'}
        }
    res.update({ 'user_id': users.get_current_user().nickname()})

    return res

@bottle.route('/test/error', method='post')
@allow_login
def raise_error():
    try:
        raise Exception(
            'Call failed. Status code {}. Body {}'.format(
                response.status_code, u'error_test done.'))
    except Exception as e:
        logging.info(e)

# Define an handler for 404 errors.
@bottle.error(404)
def error_404(error):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.'


#---start utility section------------------------------

def send_mail(nickname):
    #login mail送信
    taskqueue.Task(
            url='/master/mail/login', 
            params={'result': u'login', 'name': nickname}
            ).add('master')

def ensured_login(anchor):
    #Notice:セキュリティ上user.user_id()はクライアントに直接戻さない
    user = users.get_current_user()
    values = { 'id': 'a0', 'name': 'a0', 'anchor': anchor, 'login_url': None }
    if user:
        values['id'] = user.nickname()
        values['name'] = user.nickname()
        #login mail送信----------
        #send_mail(nickname)
    else:
        values['login_url'] = users.create_login_url(anchor)
    
    logging.info(values)
    return values



