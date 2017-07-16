# Single Page Application Template
This is a SPA template , based on the original works by mmikowski <https://github.com/mmikowski>  

本テンプレートはmmikowskiさんの「シングルページWebアプリケーション」をひな形にしながらも、最近の技術動向も踏まえてWebアプリケーションテンプレートとして動作するようにしたものです。

 参考にしたmmikowskiさんのSPAコードは<https://github.com/mmikowski>にあります。

## Features
### Simple Routing
Here is the routing part  example .

```
<nav class="mdl-navigation">
  <h2>Thirdpenナビゲーション</h2>
   <a href="/home" class="mdl-navigation__link">What are we doing this?</a>
   <a href="/newist" class="mdl-navigation__link">エントリTest</a>
   <a href="/contact" class="mdl-navigation__link">お問い合わせSample</a>
   <a href="/me" class="mdl-navigation__link">About me</a>
</nav>       
```
The url path call a function locally .The event to hear  URI Anchor changes  created by a call Pushstate  is Popstate, like so:

```
const onPopstate = event => {
  const anchor_map_proposed = spa.uriAnchor.makeAnchorMap();
  const anchor = anchor_map_proposed.page[0];
  moduleMap[anchor].initModule( stateMap.container );
};

const initModule = () => {
 //ルーティング対象はすべてmoduleMapに組み込む
 moduleMap.error = spa.error;
 moduleMap.home = spa.home;
 moduleMap.newist = spa.newist;
 moduleMap.contact = spa.contact;
        
 window.addEventListener('popstate', onPopstate);
```
The both of Pushstate and Popstate are specified from HTML5.  The spa.uriAnchor module  has two methods to create the Anchor component. They are  the above makeAnchor and the next setAnchor. :
  
  HTML5で追加されたpopStateイベントでAnchorの変化を追跡しページの切り替えをローカルに行います。モジュールのspa.uriAnchorにはAnchorコンポーネントを生成するsetAnchorとmakeAnchorMapという2つのメソッドがあります。  

```
const onLogin = event => {
  const user_map = event.detail;
  spa.uriAnchor.setAnchor( { 'page': user_map.anchor }, false );
};
```


### Publish/Subscribe Pattern
The spa.gevent is a tiny publish/subscribe based module. This has synchronisation decoupling, so topics are published asynchronously.  

サーバ側とのメッセージ交換には以下のようなPubSubパターンを使っています。

```
spa.gevent.subscribe( stateMap.container, 'spa-login', onLogin  );

ajax.post('/login', params)
  .then(response => {
    stateMap.user = JSON.parse(response);
    spa.gevent.publish( 'spa-login', stateMap.user);
  })

const onLogin = event => {
  const user_map = event.detail;
  spa.uriAnchor.setAnchor( { 'page': user_map.anchor }, false );
};
```

## Live DEMO
I use this SpaTemplate for my other projects, like SpaTodo, Blog system.  
You can check the features on thease projects.

## Note
単体で動作を確認する場合は、spa.model.jsのモックステータスをtrueにしてください。  
  

## History
javascript単体のSPAテンプレートにしました。


## Revisions

* 2016-05-26 Ryuji Oike : Origin
* 2016-06-04 Ryuji Oike: Release 1.02
* 2016-06-10 Ryuji Oike: Release 1.04
* 2016-06-27 Ryuji Oike: Release 1.05
* 2016-07-27 Ryuji Oike: Release 1.06
* 2016-10-06 Ryuji Oike: Release 1.07
* 2016-10-20 Ryuji Oike: Release 1.09
* 2017-07-16 Ryuji Oike: Release 1.10

## Licensing
See [LICENSE](LICENSE)
