/*
 * template spa.data.js
 * Copyright 2016 ryuji.oike@gmail.com
 *-----------------------------------------------------------------
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global spa */

spa.data = (() => {
  'use strict';

  const makeAjax = (() => {
      
    //paramsがない場合はnull
    const encodedString = params => {
      return _.keys(params).map(key => 
          [key ,encodeURIComponent(params[key])].join('=')
      ).join('&');
    };

    const ajaxGet = (url, params) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        if (params) {
          url += '?' + encodedString(params);
        }
        //console.info(url);
        xhr.open('GET', url, true);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.statusText);
          }
        };
        xhr.onerror = () => {
          reject(xhr.statusText);
        };
        xhr.send();
      });
    };

    const ajaxPost = (url, params) => {
      //console.info(url);
      return new Promise( (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(encodedString(params));
        xhr.onload = () => {
          //console.info(xhr.status);
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.statusText);
          }
        };
        xhr.onerror = () => {
          reject(xhr.statusText);
        };
      });
    };

    const imgLoad = (url, file) => {
      //console.info(url);
      return new Promise((resolve, reject) => {
        const 
          xhr = new XMLHttpRequest(),
          formData = new FormData();

        formData.append('file', file);
        xhr.open('POST', url);
        xhr.send(formData);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(Error('Image didn\'t load successfully; error code:' + xhr.statusText));
          }
        };
        xhr.onerror = () => {
          reject(Error('There was a network error.'));
        };
      });
    };

    return {
      get: ajaxGet,
      post: ajaxPost,
      up: imgLoad
    };

  })();


  //公開するモジュールを定義
  return {
    getAjax : makeAjax,
  };
})();

