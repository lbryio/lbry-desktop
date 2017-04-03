const querystring = require('querystring');

const lbryio = {};

const CONNECTION_STRING = 'https://apidev.lbry.tech/';

const mocks = {
  'reward_type.get': ({name}) => {
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
  },
};

lbryio.call = function(resource, action, params={}, method='get') {
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

      if (!response.success) {
        if (reject) {
          reject(new Error(response.error));
        } else {
          document.dispatchEvent(new CustomEvent('unhandledError', {
            detail: {
              connectionString: connectionString,
              method: action,
              params: params,
              message: response.error.message,
              ... response.error.data ? {data: response.error.data} : {},
            }
          }));
        }
      } else {
        console.info(`${resource}.${action} response data:`, response);
        resolve(response.data);
      }
    });

    console.log('about to call xhr.open');

    // For social media auth:
    //const accessToken = localStorage.getItem('accessToken');
    //const fullParams = {...params, ... accessToken ? {access_token: accessToken} : {}};

    // Temp app ID based auth:
    const fullParams = {app_id: localStorage.getItem('appId'), ...params};

    if (method == 'get') {
      console.info('GET ', CONNECTION_STRING + resource + '/' + action, ' | params:', fullParams);
      xhr.open('get', CONNECTION_STRING + resource + '/' + action + '?' + querystring.stringify(fullParams), true);
      xhr.send();
    } else if (method == 'post') {
      console.info('POST ', CONNECTION_STRING + resource + '/' + action, '| params: ', fullParams);
      xhr.open('post', CONNECTION_STRING + resource + '/' + action, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(querystring.stringify(fullParams));
    }
  });
};

export default lbryio;
