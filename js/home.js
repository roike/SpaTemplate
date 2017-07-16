/*
 * spa Template home.js
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
spa.home = (() => {
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
    domMap.greeting = document.getElementById('greeting-form');
  };
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  
  //formの送信
  const onSubmit = evt => {
    evt.preventDefault();
    var firstname = evt.target.elements.firstname.value;
    var lastname = evt.target.elements.lastname.value;
    var greeting = 'Hello';
    if (firstname || lastname) {
      greeting += ', ';
      if (firstname && lastname) {
        greeting += firstname + ' ' + lastname;
      } else if (lastname) {
        greeting += 'Mx. ' + lastname;
      } else {
        greeting += firstname;
      }
    }
    greeting += '!';
    spa.model.greeting.set(greeting);
    spa.uriAnchor.setAnchor( { 'page': 'greeting'}, false );
  };

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
    container.innerHTML = spa.home.template;
    stateMap.container = container;
    setDomMap();
    
    //グローバルカスタムイベントのバインド
    // ローカルイベントのバインド
    domMap.greeting.addEventListener('submit', onSubmit, false);

    //mdcイベントの再登録
    window.mdc.autoInit(document, () => {});
  };


  // return public methods
  return {
    configModule: configModule,
    initModule: initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
})();

spa.home.template = (() => {

  return `
    <h1 class="mdc-typography--display1">Tell us about yourself!</h1>
      <form action="/greeting" id="greeting-form">
        <div>
          <div class="mdc-form-field">
            <div class="mdc-textfield" data-mdc-auto-init="MDCTextfield">
              <input id="firstname" type="text" class="mdc-textfield__input">
              <label for="firstname" class="mdc-textfield__label">
                First Name
              </label>
            </div>
          </div>

          <div class="mdc-form-field">
            <div class="mdc-textfield" data-mdc-auto-init="MDCTextfield">
              <input id="lastname" type="text" class="mdc-textfield__input">
              <label for="lastname" class="mdc-textfield__label">
                Last Name
              </label>
            </div>
          </div>
        </div>
        <button type="submit"
                class="mdc-button
                       mdc-button--raised
                       mdc-button--primary
                       mdc-ripple-surface"
                data-mdc-auto-init="MDCRipple">
          Print Greeting
        </button>
      </form>`;
})();
