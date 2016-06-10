/*
 * template spa.model.js
 * Copyright 2016 ryuji.oike@gmail.com
 *-----------------------------------------------------------------
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global spa */

/*
 -----ajaxの引数---------------
 ajax.get(url, params)
 ajax.post(url, params)
 -----response-----------------
 data = JSON.parse(response) == {publish: <val>, appsid: <appsid>}
*/
spa.model = (() =>{
  'use strict';
  //データキャッシュ
  let stateMap = {
    user: null,
  };

  //モックステータス--false-->fakeデータ使用
  const isFakeData = false;

  //サーバ側で認証テスト(@allo_login)を行っている場合はこちらでresponseをwrapperする
  const publish = (customEvent, data) => {
    if (_.has(data, 'publish')) {
      spa.gevent.publish(customEvent, data.publish);
    } else {
      //サーバ側認証が通らない-->ローカルとサーバのidが不一致
      //data=={id:,name:,anchor:,login_url:}の構造になる
      stateMap.user = data;
      spa.gevent.publish( 'spa-login', stateMap.user);
    }
  };

  //インスタンスオブジェクト------------------------
  const User = (() => {
    const ajax = isFakeData ? spa.fake.mockAjax : spa.data.getAjax;

    //stateMap.user = {id:,name:,anchor:,login_url:}
    const login = urlList => {
      //console.info(urlList);
      const params = {page: JSON.stringify(urlList)};
      ajax.post('/login', params)
        .then(response => {
          stateMap.user = response;
          spa.gevent.publish( 'spa-login', stateMap.user);
        })
        .catch(error => {
          spa.gevent.publish('spa-error', error);
        })
    };

    return {
      get: () => stateMap.user,
      login: login
    };

  })();

  const Test = (() => {
    const 
      ajax = isFakeData ? spa.fake.mockAjax : spa.data.getAjax,
      channel = spa.data.getSio;

    const load = url => {
      if (url.includes('upload')) {
        publish(
            'change-test',
            { publish:
               {
                entry: 'upload',
                title: '画像ファイルアップロード',
                content: '<input type="file" id="handle-image" />'
               }
            }
            );
        return false;
      }
      
      const params = {'user_id': stateMap.user.id}
      if (url.includes('spoofing')) params.user_id = 'spoof';
      ajax.post(url, params)
        .then(response => {
          publish('change-test', response);
        })
        .catch(error => {
          spa.gevent.publish('spa-error', error);
        });
    };

    const openChannel = () => {
      ajax.post('/test/channel/token', {'user_id': stateMap.user.id})
        .then(response => {
          channel.open(response.token);
        })
        .catch(error => {
          spa.gevent.publish('spa-error', error);
        });

    };

    const closeChannel = () => {
      channel.close();
    };

    return {
      load: load,
      channel: openChannel,
      close: closeChannel,
      upload: file => ajax.up('/upload', file)
    };

  })();

  const Contact =(() => {
    const ajax = isFakeData ? spa.fake.mockAjax : spa.data.getAjax;

    const sendMail = (url, params) => {
      params['user_id'] = stateMap.user.id;
      ajax.post(url, params)
        .then(response => {
          publish('change-contact', response);
        })
        .catch(error => {
          spa.gevent.publish('spa-error', error);
        });
    };

    return {
      mail: sendMail
    };
  })();

  const initModule = () => {
    //userオブジェクト初期値生成-->初期値-->name='00'-->ログイン未確認
    stateMap.user = { id: '00', name: '00', login_url: null };
  };

  return {
    initModule: initModule,
    user: User,
    test: Test,
    contact: Contact
  };
})();
