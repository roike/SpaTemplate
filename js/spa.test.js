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
      //null宣言するとspa.shellで値がセットされる
      anchor: null,
      anchor_schema: null
    },
    stateMap  = {
      //ローカルキャッシュはここで宣言
      container: null
    },
    domMap = {};

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
      content: document.getElementById('test-content')
    };
  };


  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  const onHandleClick = event => {
    var element = _.find(event.path, (element) => {
      //constはundefinedを宣言できないのでvarで宣言
      if (element.tagName === 'A') {
        return element;
      }
    });
    //console.info(element);
    //element.classList.contains("someTag")
    if(element) {
      const hrefList = element.href.split('/'),
        schema = _.intersection(hrefList, configMap.anchor_schema);

      //console.info(hrefList);
      if(schema.length > 0) {
        test_model.close(); 
      }
    }
  };

  //グローバルカスタムイベントのコールバック
  const onTest = event => {
    const embed = event.detail;
    stateMap.container.innerHTML = spa.test.template(embed);
    if (embed.entry === 'channel') test_model.channel();

    setDomMap();

    //ローカルイベントのバインド
    document.getElementById('test-container').addEventListener('click', onHandleClick, false);

    //mdlイベントの再登録
    componentHandler.upgradeDom();
  };

  const onChannel = event => {
    const message = event.detail;
    domMap.content
    domMap.content.innerText = message;

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
    spa.gevent.subscribe( stateMap.container, 'channel-test', onChannel);

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
        <div class="test-section mdl-card__supporting-text">
          <div id="test-content">${content}</div>
        </div>
      </div>
      <nav class="test-nav mdl-cell mdl-cell--12-col">
        <a href="/newist">
          <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" >
            <i class="material-icons" role="presentation">arrow_back</i>
          </button>
        </a>
      </nav>
    </div>`;
};

