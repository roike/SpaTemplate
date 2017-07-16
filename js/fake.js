/*
 * spa Template fake.js
 * See License
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.fake = (function () {
  'use strict';

  const mockAjax = (() => {
    const mockGet = url => {
      const pageList = url.split('/');
      const tindex = pageList.indexOf('thirdpen') + 1;
      const mockKey = pageList[tindex];
      return new Promise((resolve, reject) => {
        resolve(spa.fake.data[mockKey]);
        reject();
      });
    };

    const mockPost = (url, params) => {
      const mockKey = _.last(url.split('/'));
      return new Promise((resolve, reject) => {
        resolve(spa.fake.data[mockKey]);
        reject();
      });
    };
      
    return {
      get: mockGet,
      post: mockPost
    };

  })();

  
  return {
    mockAjax : mockAjax
  };
})();

spa.fake.data = (() => {
  const fakedata = [
    {
      
    }
  ];

  return {
    identify: {
      appid: 'thirdpen',
      anchor: '/home'
    },
    greeting: {publish: fakedata}
    };
})();
