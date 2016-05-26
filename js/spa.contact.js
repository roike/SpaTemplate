/*
 * template spa.contact.js
 * Copyright 2016 ryuji.oike@gmail.com
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global spa */
spa.contact = (() => {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  let
    configMap = {},
    stateMap  = {
      //ローカルキャッシュはここで宣言
      container: null,
    },
    domMap = {};
  //定数はここで宣言
  //公開モジュールを参照する場合はここで宣言
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  //DOMメソッドにはページ要素の作成と操作を行う関数を配置
  //Class名はcontainer内でユニーク
  const setDomMap = function () {
    domMap = {
    };
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
    container.innerHTML = spa.contact.template;
    stateMap.container = document.getElementById('contact-container');
    
    //グローバルカスタムイベントのバインド
    
    //mdlイベントの再登録
    componentHandler.upgradeDom();

  };


  // return public methods
  return {
    configModule: configModule,
    initModule: initModule,
  };
  //------------------- END PUBLIC METHODS ---------------------
})();

spa.contact.template = (() => {
  //
  return `
    <article id="contact-container">
      <div class="contact-content mdl-grid">
        <div class="mdl-card mdl-cell--12-col mdl-shadow--4dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Contact</h2>
          </div>
          <div class="mdl-card__media">
            <img class="article-image" src=" /images/banner.png" border="0" alt="">
          </div>
          <div class="mdl-card__supporting-text">
            <p>
            問い合わせフォームのサンプルページです。投稿はしません。
            </p>
            <form action="/home" class="">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" pattern="[A-Z,a-z, ]*" type="text" id="Name">
                <label class="mdl-textfield__label" for="Name">Name...</label>
                <span class="mdl-textfield__error">Letters and spaces only</span>
              </div>
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="Email">
                <label class="mdl-textfield__label" for="Email">Email...</label>
              </div>
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <textarea class="mdl-textfield__input" type="text" rows="5" id="note"></textarea>
                <label class="mdl-textfield__label" for="note">Enter note</label>
              </div>
              <p>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" type="submit">
                    Submit
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </article>`;
})()
