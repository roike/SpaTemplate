/*
 * template spa.home.js
 * Copyright 2016 ryuji.oike@gmail.com
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
  };

  // Begin public method /initModule/
  const initModule = container => {
    container.innerHTML = spa.home.template;
    stateMap.container = document.getElementById('home-container');
    
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

spa.home.template = (() => {
  //
  return `
    <article id="home-container">
      <div class="home-content mdl-grid">
        <div class="mdl-card mdl-cell--12-col mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2>About This Template</h2>
          </div>
          <section class="home-section mdl-card__supporting-text">
            <h3>What we do ?</h3>
            <figure>
              <img alt="About ThirdPen" src="../images/logo@2x.png">
            </figure>
            <p>
            Single Page Application Template for Google App Enginの動作検証サイトです。
            Chromeでのみ動作を確認していますが、ES6、HTML5、CSS3に対応したブラウザであれば動作するはずです。
            </p>
            <p>
            本テンプレートはmmikowskiさんの「シングルページWebアプリケーション」に構造の大枠を依存しながらも、
            最近の技術動向も踏まえてGAEのWebアプリケーションテンプレートとして動作するようにしたものです。
            コードの中身はオリジナルと大きく変わっていますが、超重量級SPAライブラリ類とは真逆に、
            超軽量で透過的なライブラリというmmikowskiさんの考え方を踏襲しています。
            </p>
          </section>
          <section class="home-section mdl-card__supporting-text">
            <h3>本テンプレートの特徴</h3>
            <p>
            本サイトの表示はフォントにWebフォント(Noto Sans Japanease)、レイアウトにMaterial Design Lightを使いました。
            実装的な特徴として、画面遷移の契機にはオリジナルのハッシュバンではなくpushStateを使用しています。
            Google検索では前者の推薦を終了して後者を歓迎していますが、画面遷移的にもより自然だと感じています。
            ES6に依存する一方でjQueryは除きました。利用する必要性がなくなってきていることとDomに直接触れない方向を模索中ということが理由です。
            またデータの送受信はコールバック仕様ではなく、オリジナル同様、PubSub仕様に沿ったイベント駆動を採用しています。
            </p>
            <p>
            mmikowskiさんのSPAオリジナルコードは<a href="https://github.com/mmikowski">こちらに</a>あります。
          </section>
        </div>
      </div>
    </article>`;
})();
