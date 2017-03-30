const querystring = require('querystring');

const lbryio = {};

const CONNECTION_STRING = 'https://api.lbry.io/';

const mocks = {
  'reward_type.get': (name) => {
    return {
      name: 'link_github',
      title: 'Link your GitHub account',
      description: 'Link LBRY to your GitHub account',
      value: 50,
      claimed: false,
    };
  },
  'reward_type.list': () => {
    return [
      {
        name: 'link_github',
        title: 'Link your GitHub account',
        description: 'Link LBRY to your GitHub account',
        value: 50,
        claimed: false,
      },
    ];
  }
};

lbryio.call = function(resource, action, params, method='get') {
  return new Promise((resolve, reject) => {
    /* temp code for mocks */
    if (`${resource}.${action}` in mocks) {
      resolve(mocks[`${resource}.${action}`](params));
      return;
    }

    /* end temp */

    console.log('about to create xhr object');
    const xhr = new XMLHttpRequest;
    xhr.addEventListener('error', function (error) {
      console.log('received XHR error:', error);
      reject(error);
    });


    console.log('about to add timeout listener');
    xhr.addEventListener('timeout', function() {
      console.log('XHR timed out');

      reject(new Error('XMLHttpRequest connection timed out'));
    });

    console.log('about to create load listener');
    xhr.addEventListener('load', function() {
      console.log('loaded');
      const response = JSON.parse(xhr.responseText);

      if (response.error) {
        if (reject) {
          reject(new Error(response.error));
        } else {
          document.dispatchEvent(new CustomEvent('unhandledError', {
            detail: {
              connectionString: connectionString,
              method: method,
              params: params,
              code: response.error.code,
              message: response.error.message,
              data: response.error.data,
            }
          }));
        }
      } else {
        resolve(response.result);
      }
    });

    console.log('about to call xhr.open');
    xhr.open(method, CONNECTION_STRING + resource + '/' + action, true);
    xhr.send(querystring.stringify(params));
  });
};

export default lbryio;
