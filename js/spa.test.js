/*
 * template spa.test.js
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
spa.test = (() => {
  'use strict';
  //-------BEGIN SCOPE VARIABLES----------------------------
  let
    configMap = {
      anchor: null,
    },
    stateMap  = {
      //ローカルキャッシュはここで宣言
      container: null,
      offset: 0,
      tags: 'all'
    },
    domMap = {};
  //定数はここで宣言
  
  //公開モジュールを参照する場合はここで宣言
  const test_model = spa.model.test;

  //----END SCOPE VARIABLES-------------------------------- 

  //------------------- BEGIN UTILITY METHODS ------------------
  
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  //DOMメソッドにはページ要素の作成と操作を行う関数を配置
  //可読性のためtarget elementは分散させずにここで宣言
  const setDomMap = () => {
    domMap = {
    };
  };


  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  //グローバルカスタムイベントのコールバック
  const onTest = event => {
    const embed = event.detail;
    stateMap.container.innerHTML = spa.test.template(embed);

    //mdlイベントの再登録
    componentHandler.upgradeDom();
  };

  
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  const configModule = input_map => {
    spa.util.setConfigMap({
      input_map: input_map,
      config_map: configMap
    });
  };

  // Begin public method /initModule/
  const initModule = container => {
    container.innerHTML = '<article id="test-container"></article>';
    stateMap.container = document.getElementById('test-container');
    
    //グローバルカスタムイベントのバインド
    spa.gevent.subscribe( stateMap.container, 'change-test', onTest);

    //ローカルイベントのバインド

    test_model.load('/' + configMap.anchor.page.join('/'));
  };

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
})();

spa.test.template =({entry, title, content}) => {
  return `
    <div class="test-content mdl-grid">
      <div class="mdl-card mdl-cell--12-col mdl-shadow--2dp">
        <header class="test-header">
          <span>Test&nbsp;|&nbsp;${entry}</span>
        </header>
        <div class="mdl-card__title">
          <h2>${title}</h2>
        </div>
        <div class="blog-section mdl-card__supporting-text">
          ${content}
        </div>
      </div>
      <nav class="blog-nav mdl-cell mdl-cell--12-col">
        <a href="/newist" id="newist-more" title="show more">
          <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" >
            <i class="material-icons" role="presentation">arrow_back</i>
          </button>
        </a>
      </nav>
    </div>`;
};

