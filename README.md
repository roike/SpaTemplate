##Single Page Application Skeleton for Google App Engine with Python
本テンプレートはmmikowskiさんの「シングルページWebアプリケーション」をひな形にしながらも、最近の技術動向も踏まえてGAEのWebアプリケーションテンプレートとして動作するようにしたものです。

 参考にしたmmikowskiさんのSPAコードは<https://github.com/mmikowski>にあります。

##Features
The event to hear  URI Anchor changes  created by a call Pushstate  is Popstate, like so:

```
const onPopstate = event => {
  moduleMap[anchor].initModule( stateMap.container );
};
       
window.addEventListener('popstate', onPopstate);
```
The both of Pushstate and Popstate are specified from HTML5.  The spa.uriAnchor.js module  has two methods to create the Anchor component. They are  the setAnchor and the makeAnchor.  

HTML5で追加されたpopStateイベントでAnchorの変化を追跡しページの切り替えをローカルに行います。モジュールのspa.uriAnchorにはAnchorコンポーネントを生成するsetAnchorとmakeAnchorMapという2つのメソッドがあります。  

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


##Demo
本テンプレートの動作検証サイトは<https://elabo-two.appspot.com>にあります。  
デモサイトでは、フォントにWebフォント(Noto Sans Japanease)、レイアウトにMaterial Design Lightを使っています。  

Chromeでのみ動作を確認していますが、ES6、HTML5、CSS3に対応したブラウザであれば動作するはずです。なおデモサイトはGoogleログインが必要です。

##Revisions

* 2016--5-26 Ryuji Oike : Origin

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give
feedback on this repo and to ask for skeletons for other frameworks or use cases.

## Contributing changes
See [CONTRIB.md](CONTRIB.md)

## Licensing
See [LICENSE](LICENSE)

## Run Locally
1. Install the [App Engine Python SDK](https://developers.google.com/appengine/downloads).
You'll need python 2.7 and [pip 1.4 or later](http://www.pip-installer.org/en/latest/installing.html) installed too.

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
4. Run this project locally from the command line:

   ```
   dev_appserver.py .
   ```

Open [http://localhost:8080](http://localhost:8080)

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

### Relational Databases and Datastore
To add persistence to your models, use
[NDB](https://developers.google.com/appengine/docs/python/ndb/) for
scale.  Consider
[CloudSQL](https://developers.google.com/appengine/docs/python/cloud-sql) if you need a
relational database.

### Installing Libraries
See the [Third party
libraries](https://developers.google.com/appengine/docs/python/tools/libraries27)
page for libraries that are already included in the SDK.  To include SDK
libraries, add them in your app.yaml file. All other libraries must be included
in your project directory in order to be used by App Engine.  Only pure python
libraries may be added to an App Engine project.




