#!/usr/bin/env python
# -*- coding: utf-8 -*-
# spa template on GAE
# main Copyright 2016 ryuji.oike@gmail.com
# ---------------------------------------------

from google.appengine.api import users, taskqueue, channel, memcache
from bottle import Bottle, debug, request, response, static_file, abort
from json import loads, dumps
import logging, uuid, time
#localモジュール---------------------------------
from controllers.entry import write_gcs, read_gcs

FORMATS = dict(jpg='image/jpeg', png='image/png', gif='image/gif')

bottle = Bottle()
debug(True)

#選択可能なanchorを設定する
ALLOW_ANCHOR = ['login', 'home', 'newist', 'contact', 'test']




#downLoadのget Requestを通過させる-----------------
@bottle.route('/dwload/<filename>')
def dwload_image(filename):
    img_format = filename.split('.')[-1]
    content_type = FORMATS.get(img_format)
    if content_type:
        response.headers['Content-Type'] = content_type
        return read_gcs(filename)

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

    abort(404, 'Sorry, Nothing at this URL.')

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
        if request_user == login_user.nickname():
            return func(*args, **kwargs)
        #if login_user is None or request_user != login_user.nickname():
        response.status = 403
        #response.content_type = 'application/json; charset=utf-8'
        return {'error': 'Forbidden, No access right.'}
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
#except Exception as e: abort(500)
@bottle.route('/login', method='post')
def user_login():
    anchor = '/' + '/'.join(loads(request.forms.get('page')))
    return ensured_login(anchor)

#データ取得動作の確認
@bottle.route('/test/publish', method='post')
@allow_login
def publish():
    res = { 'publish': {
        'content': u'リクエストを取得しました。',
        'entry': u'publish',
        'title': u'データの取得'}
        }

    return res

#ユーザチェック動作の確認
@bottle.route('/test/identify', method='post')
def test_identify():
    user = users.get_current_user()
    anchor = '/test/identified'
    values = { 'id': 'a0', 'name': 'a0', 'anchor': anchor, 'login_url': None }
    values['login_url'] = users.create_login_url(anchor)
    
    #logging.info(values)
    return values

@bottle.route('/test/identified', method='post')
@allow_login
def test_identify2():
    res = { 'publish': {
        'content': u'ログイン確認後にリクエストされたページを表示しました。',
        'entry': u'identify',
        'title': u'ユーザチェック'}
        }

    return res

@bottle.route('/test/spoofing', method='post')
@allow_login
def test_spoofing():
    #インターセプトされるのでここには到達しない
    logging.info(u'spoofing test')

#リアルタイム通信の動作確認
@bottle.route('/test/channel', method='post')
@allow_login
def test_channel():

    res = { 'publish': {
        'content': u'通信チャネルをオープンしています。',
        'entry': u'channel',
        'title': u'リアルタイム通信'}
        }

    return res

@bottle.route('/test/channel/token', method='post')
@allow_login
def create_channel():
    user = users.get_current_user()
    cache = memcache.get(user.user_id())
    if cache:
        cid = cache[0]
        token = cache[1]
    else:
        cid = str(uuid.uuid4())
        #tokenの有効時間は5分
        token = channel.create_channel(cid, 5)
        #tokenの保存は5分
        memcache.add(key=user.user_id(), value=[cid, token], time=300)

    res = { 'token': token }


    #message送信
    time.sleep(2)
    taskqueue.Task(
        url='/test/channel/send', 
        params={'custom': 'channel-test', 'cid': cid}
        ).add('default')
    
    return res

@bottle.route('/test/channel/send', method='post')
def task_channel():
    try:
        cid = request.forms.get('cid')
        message = dumps({
            'callback': request.forms.get('custom'),
            'publish': u'メッセージを受信しました。'
            })
        time.sleep(2)
        channel.send_message(cid, message)
    except Exception as e:
        logging.info(e)
        abort(500)

# In the handler for _ah/channel/connected/
@bottle.route('/_ah/channel/connected/', method='post')
def connect_channel():
    client_id = request.forms.get('from')
    logging.info("Connected from the '%s'" % client_id )

@bottle.route('/_ah/channel/disconnected/', method='post')
def connect_channel():
    client_id = request.forms.get('from')
    logging.info("Disonnected from the '%s'" % client_id )


#エラーページの表示動作確認
@bottle.route('/test/error', method='post')
@allow_login
def raise_error():
    try:
        raise Exception(
            'Call failed. Status code {}. Body {}'.format(
                500, u'error_test done.'))
    except Exception as e:
        logging.info(e)
        abort(500)

#画像ファイルアップロード動作の確認
#fileの有無はjavascriptでチェック済み
@bottle.route('/upload', method='post')
def upload_file():
    #filesize = int(request.headers['Content_Length'])
    upload =request.files.get('file')
    try:
        filename = write_gcs(upload)
        return dict(filename=filename)
    except Exception as e:
        loging.info(e)
        abort(500)


#contact動作の確認
@bottle.route('/contact', method='post')
def contact_mail():
    user = users.get_current_user()
    params={
        'name': request.forms.get('name'),
        'email': user.email(),
        'note': request.forms.get('note')
    }
    logging.info(params)
    try:
        taskqueue.Task(
            url='/task/mail/contact', 
            params=params
        ).add('task')
        
        return {'publish': u'メールを送信しました。'}
    except Exception as e:
        loging.info(e)
        abort(500)

#messageのfadein fadeoutの確認



#---start utility section------------------------------

def send_mail(nickname):
    #login mailのinbound 送信
    taskqueue.Task(
            url='/task/mail/login', 
            params={'result': u'login', 'name': nickname}
            ).add('task')

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



