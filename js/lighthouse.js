import lbry from './lbry.js';

var lighthouse = {
  _search_timeout: 5000,
  _max_search_tries: 5,

  servers: [
    'http://lighthouse4.lbry.io:50005',
    'http://lighthouse5.lbry.io:50005',
    'http://lighthouse6.lbry.io:50005',
  ],
  path: '/',

  call: function(method, params, callback, errorCallback, connectFailedCallback, timeout) {
    lbry.jsonrpc_call(this.server + this.path, method, params, callback, errorCallback, connectFailedCallback, timeout);
  },

  search: function(query, callback, errorCallback, connectFailedCallback, timeout) {
    let handleSearchFailed = function(tryNum=0) {
      if (tryNum > lighthouse._max_search_tries) {
        if (connectFailedCallback) {
          connectFailedCallback();
        } else {
          throw new Error(`Could not connect to Lighthouse server. Last server attempted: ${lighthouse.server}`);
        }
      } else {
        // Randomly choose one of the other search servers to switch to
        let otherServers = lighthouse.servers.slice();
        otherServers.splice(otherServers.indexOf(lighthouse.server), 1);
        lighthouse.server = otherServers[Math.round(Math.random() * (otherServers.length - 1))];

        lighthouse.call('search', [query], callback, errorCallback, function() {
          handleSearchFailed(tryNum + 1);
        }, lighthouse._search_timeout);
      }
    }

    lighthouse.call('search', [query], callback, errorCallback, function() { handleSearchFailed() }, lighthouse._search_timeout);
  },

  getSizeForName: function(name, callback, errorCallback, connectFailedCallback, timeout) {
    return lighthouse.call('get_size_for_name', [name], callback, errorCallback, connectFailedCallback, timeout);
  }
};

lighthouse.server = lighthouse.servers[Math.round(Math.random() * (lighthouse.servers.length - 1))];

export default lighthouse;
