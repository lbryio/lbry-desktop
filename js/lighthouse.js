import lbry from './lbry.js';

var lighthouse = {
  _query_timeout: 5000,
  _max_query_tries: 5,

  servers: [
    'http://lighthouse4.lbry.io:50005',
    'http://lighthouse5.lbry.io:50005',
    'http://lighthouse6.lbry.io:50005',
  ],
  path: '/',

  call: function(method, params, callback, errorCallback, connectFailedCallback, timeout) {
    const handleConnectFailed = function(tryNum=0) {
      if (tryNum > lighthouse._max_query_tries) {
        if (connectFailedCallback) {
          connectFailedCallback();
        } else {
          throw new Error(`Could not connect to Lighthouse server. Last server attempted: ${lighthouse.server}`);
        }
      } else {
        lbry.call(method, params, callback, errorCallback, () => { handleConnectFailed(tryNum + 1) }, timeout);
      }
    }

    // Set the Lighthouse server if it hasn't been set yet, or if the current server is not in
    // the current set of servers (most likely because of a settings change).
    if (typeof lighthouse.server === 'undefined' || lighthouse.getServers().indexOf(lighthouse.server) == -1) {
      lighthouse.chooseNewServer();
    }

    lbry.jsonrpc_call(this.server + this.path, method, params, callback, errorCallback,
                      () => { handleConnectFailed() }, timeout || lighthouse.query_timeout);
  },

  getServers: function() {
    return lbry.getClientSetting('useCustomLighthouseServers')
      ? lbry.getClientSetting('customLighthouseServers')
      : lighthouse.servers;
  },

  chooseNewServer: function() {
    // Randomly choose a new Lighthouse server and switch to it. If a server is already set, this
    // will choose a different one (used for switching servers after a failed query).
    const servers = lighthouse.getServers();
    let newServerChoices;
    if (!lighthouse.server) {
      newServerChoices = servers;
    } else {
      newServerChoices = lighthouse.getServers().slice();
      newServerChoices.splice(newServerChoices.indexOf(lighthouse.server), 1);
    }
    lighthouse.server = newServerChoices[Math.round(Math.random() * (newServerChoices.length - 1))];
  },

  search: function(query, callback, errorCallback, connectFailedCallback, timeout) {
    lighthouse.call('search', [query], callback, errorCallback, connectFailedCallback, timeout);
  },

  getSizeForName: function(name, callback, errorCallback, connectFailedCallback, timeout) {
    lighthouse.call('get_size_for_name', [name], callback, errorCallback, connectFailedCallback, timeout);
  }
};


export default lighthouse;
