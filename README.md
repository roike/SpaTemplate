##Single Page Application Template for Google App Engine with Python
This is a SPA template , based on the original works by mmikowski <https://github.com/mmikowski>  

本テンプレートはmmikowskiさんの「シングルページWebアプリケーション」をひな形にしながらも、最近の技術動向も踏まえてGAEのWebアプリケーションテンプレートとして動作するようにしたものです。

 参考にしたmmikowskiさんのSPAコードは<https://github.com/mmikowski>にあります。

##Features
###Simple Routing
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
The both of Pushstate and Popstate are specified from HTML5.  The spa.uriAnchor.js module  has two methods to create the Anchor component. They are  the above makeAnchor and the next setAnchor. :
  
  HTML5で追加されたpopStateイベントでAnchorの変化を追跡しページの切り替えをローカルに行います。モジュールのspa.uriAnchorにはAnchorコンポーネントを生成するsetAnchorとmakeAnchorMapという2つのメソッドがあります。  

```
const onLogin = event => {
  const user_map = event.detail;
  spa.uriAnchor.setAnchor( { 'page': user_map.anchor }, false );
};
```


###Publish/Subscribe Pattern
The spa.gevent.js is a tiny publish/subscribe based module. This has synchronisation decoupling, so topics are published asynchronously.  

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

###GAE Apis implemented
次のApiは実装例として予め組み込んでいます。

* Channel Api
* File Upload with Cloud Storage
* Taskqueue Api
* Service behaves like a microservice. 

##Live DEMO

Check a live Demo here <https://elabo-two.appspot.com>.  
デモサイトでは試験的にWebフォント(Noto Sans Japanease)とMaterial Design Lightを使っています。  

Tested with only Chrome. However it will work in any modern browser that supports ES6, HTML5, CSS3.  

Chromeでのみ動作を確認していますが、ES6、HTML5、CSS3に対応したブラウザであれば動作するはずです。なおデモサイトはGoogleログインが必要です。

## Run Locally
1. Install the [App Engine Python SDK](https://developers.google.com/appengine/downloads).
You'll need python 2.7 and [pip 1.4 or later](http://www.pip-installer.org/en/latest/installing.html) installed too.
  
  Also need following libraries at locally:   
Pillow

2. Clone this repository with

   ```
   git clone https://github.com/roike/SpaTemplate.git
   ```
3. Install dependencies in the project's `lib/` directory.
   Note: App Engine can only import libraries from inside your project directory.

   ```
   cd appengine-your-project
   pip install -r requirements.txt -t lib/
   ```
Note:If you meet 'DistutilsOptionError: must supply either home or prefix/exec-prefix — not both', 
You can make this "empty prefix" the default by adding a ~/.pydistutils.cfg file with the following contents:  
[install]  
prefix=  
But have in mind this causes the virtualenv command to break.

4. Run this project locally from the command line:

   ```
   dev_appserver.py .
   ```
5. Override the routing rules using dispatch.yaml  

 ```
dev_appserver.py --enable_sendmail=yes dispatch.yaml app.yaml youre_module.yaml
```
6. Open [http://localhost:8080](http://localhost:8080)  
if override the routing, running at localhost:8081

 
See [the development server documentation](https://developers.google.com/appengine/docs/python/tools/devserver)
for options when running dev_appserver.

## Deploy
To deploy the application:

1. Use the [Admin Console](https://appengine.google.com) to create an app and
   get the project/app id. (App id and project id are identical)
1. [Deploy the
   application](https://developers.google.com/appengine/docs/python/tools/uploadinganapp) with

```
appcfg.py -A <your-project-id> --oauth2 update .
```
Congratulations! Your application is now live at your-project-id.appspot.com

### Installing Libraries
See the [Third party
libraries](https://developers.google.com/appengine/docs/python/tools/libraries27)
page for libraries that are already included in the SDK.  To include SDK
libraries, add them in your app.yaml file. All other libraries must be included
in your project directory in order to be used by App Engine.  Only pure python
libraries may be added to an App Engine project.

### Mail API
For Sender, the mail address need to be listed on Email API Authorized Senders.  
See the [Using the App Engine Mail API](https://cloud.google.com/appengine/docs/python/mail/) page.  

##Revisions

* 2016-05-26 Ryuji Oike : Origin
* 2016-06-04 Ryuji Oike: Release 1.02
* 2016-06-10 Ryuji Oike: Release 1.04

## Licensing
See [LICENSE](LICENSE)




