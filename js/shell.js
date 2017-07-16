/*
 * spa Template shell.js
 * See License
 * -----------------------------------------------------------------
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global spa */

/*新規モジュールを追加する場合のtodo-------------------------
 * anchor_schemaに追加
 * ---------------------
 */

spa.shell = (() => {

  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  const
    //congigMapに静的な構成値を配置
    configMap = {},
    //stateMapにshellで共有する動的情報を配置
    //anchor_map=履歴の格納
    //container=コンテンツを動的に切り替えるセクションを宣言
    stateMap  = {
      //ローカルキャッシュはここで宣言する
      container: undefined,
      anchor_map: [],
    },
    //動的に呼び出す他モジュールを格納
    moduleMap = {},

    //Domコレクションをキャッシュ
    domMap = {},

    //定数はここで宣言
    //許可するanchorはここで宣言--モジュール名に一致
    anchor_schema = [
      'home', 'greeting'
    ];

  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  const makeError = spa.util.makeError;
  const testHistory = page => {
    //page=[schema,,,]
    //現在のurl履歴を登録する
    //戻るリンクの不適切な循環を防止する
    //ひとつ前の画面==stateMap.anchor_map[idx-1]
    //anchorを飛ばしたページを格納する場合はanchorを先に組み込む
    const pageHistory = page.join('_');
    let idx = stateMap.anchor_map.indexOf(pageHistory);
    if (anchor_schema.indexOf(pageHistory) > -1) {
      //moduleの切り替えなので履歴を初期化する
      stateMap.anchor_map = [pageHistory];
      idx = 0;
    }
    else if (idx == -1) {
      //pageHistoryに未格納なので追加する
      //anchorを飛ばした場合は組み込む
      if (stateMap.anchor_map.indexOf(page[0]) == -1) {
        stateMap.anchor_map.push(page[0]);
      }
      stateMap.anchor_map.push(pageHistory);
      idx = stateMap.anchor_map.length - 1;
    }
    else if (stateMap.anchor_map.length - idx > 1) {
      //同じものがある場合は循環を避けるために後順位を捨てる
      //例:[ab, abc, abcd]の時にabcが来たら[ab, abc]としてabcdを捨てる
      stateMap.anchor_map = stateMap.anchor_map.slice(0, idx + 1);
    } else {
      //(stateMap.anchor_map.length - idx == 1 -->重複クリック
      console.info('lastIndex is same: %s', pageHistory);
    }
    //ひとつ前の画面のページ配列をunderbarで連結する 
    return idx == 0 ? null : stateMap.anchor_map[idx-1].split('_');
  };

  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  //グローバルカスタムイベントのコールバック
  const onIdentify = event => {
    //apprication_idのチェック
    //console.info(event.detail);
    const app_map = event.detail
    spa.uriAnchor.setAnchor( { 'page': app_map.anchor }, false );
  };

  const onError = event => {
    const error = {
      name: 'server',
      message: event.detail,
      data: null
    };
    moduleMap.error.configModule({
      error_model: error
    });
    moduleMap.error.initModule( stateMap.container );

  };

  const onMessage = event => {
    console.info(event.detail);

  };

  //routing for local events
  //ここでイベントを捕捉する場合はschemaのどれかが最初に必要
  //例:href='/blog/<pre>/<slug>'
  const handleAnchorClick = event => {
    const element = _.find(event.path, element => {
      if (element.tagName === 'A') {
        return element;
      }
      return false;
    });
    //console.info(element);
    //element.classList.contains("someTag")
    if(element) {
      const hrefList = element.href.split('/');
      const schema = _.intersection(hrefList, anchor_schema);

      if(schema.length > 0) {
        event.preventDefault();
        const anchor = _.rest(hrefList, _.indexOf(hrefList, schema[0]));
        spa.uriAnchor.setAnchor({page: anchor}, false);
          
      }
    }
  };

  // urlの監視--schema以外のページ要求はエラーに誘導
  // url履歴の管理
  // 親履歴(anchor only)でリセット
  // 新規の子履歴は追加
  // 現在の履歴の後の履歴は削除
  const onPopstate = event => {
    try {
      //アドレスバーのanchorを適正テスト後に取り出す
      //引数はdefault_anchor,anchorがあればそれを優先
      const anchor_map_proposed = spa.uriAnchor.makeAnchorMap('home');
      //console.info(anchor_map_proposed);
      const auth = spa.model.apps.get().appid;
      if (auth === 'appspot') {
        //apps未認証
        spa.model.apps.identify(anchor_map_proposed.page);
        return false;
      } 

      //認証済みを確認
      const anchor = anchor_map_proposed.page[0];
      const previous = testHistory(anchor_map_proposed.page);
      moduleMap[anchor].configModule({
        //各anchorで参照する汎用objectを先頭のconfigMapで宣言する
        anchor: anchor_map_proposed,
        previous: previous,
      });

      moduleMap[anchor].initModule( stateMap.container );

      return true;
    }
    catch (error) {
      //不適正なアドレスはエラー発生
      console.info(error);
      moduleMap.error.configModule({
        error_model: error
      });
      moduleMap.error.initModule( stateMap.container );
      return false;
    }
  };

  //-------------------- END EVENT HANDLERS --------------------

  //---------------------- BEGIN CALLBACKS ---------------------
  //----------------------- END CALLBACKS ---------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  //外部に公開するものを明示する
  
  const initModule = () => {
    //ルーティング対象はすべてmoduleMapに組み込む
    moduleMap.error = spa.error;
    _.each(anchor_schema, ele => {
      moduleMap[ele] = spa[ele];
    });
    stateMap.container = document.getElementById('spa');

    //グローバルカスタムイベントのバインド
    spa.gevent.initModule('spa', stateMap.container);
    spa.gevent.subscribe( 'spa', 'spa-identify',  onIdentify);
    spa.gevent.subscribe( 'spa', 'spa-error', onError );
    spa.gevent.subscribe( 'spa', 'message-marked', onMessage);

    // ローカルイベントのバインド
    document.addEventListener('click', handleAnchorClick, false);

    //callできるanchorを設定
    spa.uriAnchor.setConfig(anchor_schema);

    // Handle URI anchor change events.
    window.addEventListener('popstate', onPopstate);

  };

  
  // End PUBLIC method /initModule/
  //shellが公開するメソッド
  return {
    initModule: initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
})();
