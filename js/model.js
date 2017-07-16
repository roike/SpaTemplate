/*
 * spa Template model.js
 * See License
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
 -----response-----------------
 data = JSON.parse(response) == {publish: <val>, appsid: <appsid>}
*/
spa.model = (() =>{
  'use strict';
  //データキャッシュ
  const stateMap = {
    apps: null,
    greeting: null
  };

  //モックステータス--true-->fakeデータ使用
  const isFakeData = true;

  //インスタンスオブジェクト------------------------
  //初期値-->name='appspot'-->appid未確認-->appid確認にリダイレクト
  const Apps = (() => {
    const ajax = isFakeData ? spa.fake.mockAjax : spa.data.getAjax;
    //stateMap.apps = {appid:,token:,anchor:}
    const identify = pageList => {
      //console.info(pageList);
      const params = {page: JSON.stringify(pageList)};
      ajax.post('/identify', params)
        .then(response => {
          stateMap.apps = response;
          spa.gevent.publish('spa-identify', stateMap.apps);
        })
        .catch(error => {
          spa.gevent.publish('spa-error', error);
        })
    };

    return {
      get: () => stateMap.apps,
      identify: identify
    };

  })();

  const Greeting = (() => {
    const set = params => {
      stateMap.greeting = params;
    };

    const get = () => {
      return stateMap.greeting;
    };

    return {
      set: set,
      get: get
    };
  })();
      
  const initModule = () => {
    //userオブジェクト初期値生成-->初期値-->name='00'-->ログイン未確認
    stateMap.apps = { appid: 'appspot'};
  };

  return {
    initModule: initModule,
    apps: Apps,
    greeting: Greeting
  };
})();
