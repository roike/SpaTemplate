# SPATemplate Module Usage
Spa.js cantains core routing and pub/sub modules.You can use these modules in the following ways.  
Spa.jsはルーティングとpub/subモジュールを集めたものです。使い方の概略を以下で説明します。
## uriAnchor

### setConfig
Set the routing schema.  
Only accessible pages in the list of schema.  
スキームにあるページだけが開けます。スキーマにないページが要求された場合はデフォルト画面を表示するか、エラー画面を表示させます。

```
setConfig(anchor_schema);
```

### setAnchor
Using the specified URI, and initializes a new instance of the Uri module.  
The uri path call a function locally. And URI Anchor changes is catched by Popstate.  
指定されたURIに対応したモジュールのインスタンスを呼び出して初期化します。

```
setAnchor(anchorMap, replace_state);
sample1: setAnchor( { 'page': 'home' }, false );  
It generates the uri string '/home'.  
sample2: setAnchor( {'page': ['home','guest']}, false);  
This generates the uri string '/home/guest'. 
```

### makeAnchorMap
Take out the anchor of the address bar after proper test.

```
makeAnchorMap('home');
The default uri to specify if there is no designation of Uri module.
```

## gevent
Gevent is a tiny publish/subscribe based module. This has synchronisation decoupling, so topics are published asynchronously.  

### subscribe
Binding to a global custom event.  

```
subscribe(
  'element's identifier', 
  'custom event name',
  'call back function'
  )

```

### publish
Triggering custom events.  

```
publish(
  'custom event name',
  'data'
  )
```

## util

### setConfigMap
Incorporating an object that can be referenced in each uri module.  
It includes mainly the information of the address bar to uri instance.  
The uri of the address bar has a restful hierarchical structure, there is information needed to generate the requested page.  
Among the embedded object in setConfigMap, you have to declare the object you want to use in configMap of uri module.  

主にmakeAnchorMapで取得したアドレスバーの情報をuriインスタンスに組み込むます。  

アドレスバーのuriにはレストフルな階層構造を持たせており、要求されたページの生成に必要な情報があります。デフォルトでは要求されたページと現在のページのuriが埋め込まれますが、サイトを通じて使用するユーザー情報などのオブジェクトを組み込んで利用する等が想定されます。  

setConfigMapで埋め込まれたオブジェクトのうち、利用したいオブジェクトはuriモージュールのconfigMapで利用宣言を行います。利用宣言されないオブジェクトは組み込まれません。

```
setConfigMap({
    input_map: input_map,
    config_map   : configMap
   })
    
--usage---
//in shell module
moduleMap[anchor].configModule({
    //Declare a general-purpose object to be referred to 
    //in each uri module at the header of the configMap.  
    anchor: anchor_map_proposed,
    previous: previous,
   })

//each uri module
const
    configMap = {
      anchor: null
    },
    
const configModule = input_map => {
    spa.util.setConfigMap({
      input_map: input_map,
      config_map   : configMap
    });
    return true;
  }
  
```

