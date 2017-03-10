import lbry from './lbry.js';
import jsonrpc from './jsonrpc.js';

const queryTimeout = 5000;
const maxQueryTries = 5;
const defaultServers = [
  'http://lighthouse4.lbry.io:50005',
  'http://lighthouse5.lbry.io:50005',
  'http://lighthouse6.lbry.io:50005',
];
const path = '/';

let server = null;
let connectTryNum = 0;

function getServers() {
  return lbry.getClientSetting('useCustomLighthouseServers')
    ? lbry.getClientSetting('customLighthouseServers')
    : defaultServers;
}

function call(method, params, callback, errorCallback) {
  if (connectTryNum > maxQueryTries) {
    if (connectFailedCallback) {
      connectFailedCallback();
    } else {
      throw new Error(`Could not connect to Lighthouse server. Last server attempted: ${server}`);
    }
  }

  /**
   * Set the Lighthouse server if it hasn't been set yet, if the current server is not in current
   * set of servers (most likely because of a settings change), or we're re-trying after a failed
   * query.
   */
  if (!server || !getServers().includes(server) || connectTryNum > 0) {
    // If there's a current server, filter it out so we get a new one
    const newServerChoices = server ? getServers().filter((s) => s != server) : getServers();
    server = newServerChoices[Math.round(Math.random() * (newServerChoices.length - 1))];
  }

  jsonrpc.call(server + path, method, params, (response) => {
    connectTryNum = 0;
    callback(response);
  }, (error) => {
    connectTryNum = 0;
    errorCallback(error);
  }, () => {
    connectTryNum++;
    call(method, params, callback, errorCallback);
  });
}

const lighthouse = new Proxy({}, {
  get: function(target, name) {
    return function(...params) {
      return new Promise((resolve, reject) => {
        call(name, params, resolve, reject);
      });
    };
  },
});

export default lighthouse;
