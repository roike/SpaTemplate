##Single Page Application Template for Google App Engine with Python
本テンプレートはmmikowskiさんの「シングルページWebアプリケーション」に構造の大枠を依存しながらも、最近の技術動向も踏まえてGAEのWebアプリケーションテンプレートとして動作するようにしたものです。  

コードの中身はオリジナルと大きく変わっていますが、超重量級SPAライブラリ類とは真逆に、超軽量で透過的なライブラリというmmikowskiさんの考え方を踏襲しています。  

 mmikowskiさんのSPAオリジナルコードは<https://github.com/mmikowski>にあります。

##本テンプレートの特徴
実装的な特徴として、画面遷移の契機にはオリジナルのハッシュバンではなくpushStateを使用しています。Google検索では前者の推薦を終了して後者を歓迎していますが、画面遷移的にもより自然だと感じています。  

ES6に依存する一方でjQueryは除きました。利用する必要性がなくなってきていることとDomに直接触れない方向を模索中ということが理由です。  

またデータの送受信はコールバック仕様ではなく、オリジナル同様、PubSub仕様に沿ったイベント駆動を採用しています。


##デモサイト
本テンプレートの動作検証サイトは<https://elabo-two.appspot.com>にあります。  
デモサイトでは、フォントにWebフォント(Noto Sans Japanease)、レイアウトにMaterial Design Lightを使っています。  

Chromeでのみ動作を確認していますが、ES6、HTML5、CSS3に対応したブラウザであれば動作するはずです。

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
See the README file for directions. You'll need python 2.7 and [pip 1.4 or later](http://www.pip-installer.org/en/latest/installing.html) installed too.

2. Clone this repository with

   ```
   git clone https://github.com/roike/spa-template.git
   ```
3. Install dependencies in the project's `lib/` directory.
   Note: App Engine can only import libraries from inside your project directory.

   ```
   cd appengine-python-bottle-skeleton
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




