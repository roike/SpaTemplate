/*
 * spa Template greeting.js
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
spa.greeting = (() => {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  const
    configMap = {
      anchor: null
    },
    stateMap  = {
      //ローカルキャッシュはここで宣言
      container: null
    },
    domMap = {}
    //定数はここで宣言

    //公開モジュールを参照する場合はここで宣言
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
 
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  //DOMメソッドにはページ要素の作成と操作を行う関数を配置
  const setDomMap = () => {
    domMap.greeting =  document.getElementById('greeting');
  };
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  

  //-------------------- END EVENT HANDLERS --------------------
  //------------------- BEGIN PUBLIC METHODS -------------------
  const configModule = input_map => {
    spa.util.setConfigMap({
      input_map: input_map,
      config_map   : configMap
    });
    return true;
  };

  // Begin public method /initModule/
  const initModule = container => {
    container.innerHTML = spa.greeting.template(spa.model.greeting.get());
    stateMap.container = container;
    setDomMap();
    
    //グローバルカスタムイベントのバインド
    // ローカルイベントのバインド

    //mdcイベントの再登録

  };


  // return public methods
  return {
    configModule: configModule,
    initModule: initModule,
  };
  //------------------- END PUBLIC METHODS ---------------------
})();

spa.greeting.template = (greeting => {

  return `
    <h1 class="mdc-typography--display1">Result</h1>

      <!-- The p element below is where we'll eventually output our greeting -->
      <p class="mdc-typography--headline" >${greeting}</p>`;
});
