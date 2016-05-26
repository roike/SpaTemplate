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
 ajax.get(url, params, callback)
 ajax.post(url, params, callback)
 paramsがない場合はnullにする
 -----response-----------------
 data = JSON.parse(response) == {publish: <val>, appsid: <appsid>}
*/
spa.model = (() =>{
  'use strict';
  //データキャッシュ
  let stateMap = {
    user: null,
  };

  const publish = (customEvent, data) => {
    if (_.has(data, 'publish')) {
      spa.gevent.publish(customEvent, data.publish);
    } else {
      //サーバ側認証が通らない-->ローカルとサーバのidが不一致
      //name=='a0'-->未ログイン-->ログインにリダイレクト
      //data=={id:,name:,anchor:,login_url:}の構造になる
      stateMap.user = data;
      spa.gevent.publish( 'spa-login', stateMap.user);
    }
  };

  //インスタンスオブジェクト------------------------
  //初期値-->name='00'-->ログイン未確認
  //未ログイン-->name=='a0'-->ログインにリダイレクト
  //ゲスト-->name=='a1'-->guestログインを許可
  const User = (() => {
    const ajax = spa.data.getAjax;

    //stateMap.user = {id:,name:,anchor:,login_url:}
    const login = urlList => {
      //console.info(urlList);
      const params = {page: JSON.stringify(urlList)};
      ajax.post('/login', params)
        .then(response => {
          stateMap.user = JSON.parse(response);
          spa.gevent.publish( 'spa-login', stateMap.user);
        })
        .catch(error => {
          console.info(error);
          spa.gevent.publish('spa-error', error);
        })
    };

    return {
      get: () => stateMap.user,
      login: login
    };

  })();

  const Test = (() => {
    const ajax = spa.data.getAjax;

    const load = url => {
      ajax.post(url, {'user_id': stateMap.user.id})
        .then(response => {
          const data = JSON.parse(response);
          publish('change-test', data);
        })
        .catch(error => {
          console.info(error);
          spa.gevent.publish('spa-error', error);
        });
    };

    return {
      load: load,
    };

  })();


  const initModule = () => {
    //userオブジェクト初期値生成-->初期値-->name='00'-->ログイン未確認
    stateMap.user = { id: '00', name: '00', login_url: null };
  };

  return {
    initModule: initModule,
    user: User,
    test: Test
  };
})();
