lbry.lighthouse = {
  _search_timeout: 5000,
  _max_search_tries: 5,

  servers: [
    'http://lighthouse1.lbry.io:50005',
    'http://lighthouse2.lbry.io:50005',
    'http://lighthouse3.lbry.io:50005',
  ],
  path: '/',

  call: function(method, params, callback, errorCallback, connectFailedCallback, timeout) {
    lbry.jsonrpc_call(this.server + this.path, method, params, callback, errorCallback, connectFailedCallback, timeout);
  },

  search: function(query, callback) {
    let handleSearchFailed = function(tryNum=0) {
      if (tryNum > lbry.lighthouse._max_search_tries) {
        throw new Error(`Could not connect to Lighthouse server. Last server attempted: ${lbry.lighthouse.server}`);
      } else {
        // Randomly choose one of the other search servers to switch to
        let otherServers = lbry.lighthouse.servers.slice();
        otherServers.splice(otherServers.indexOf(lbry.lighthouse.server), 1);
        lbry.lighthouse.server = otherServers[Math.round(Math.random() * (otherServers.length - 1))];

        lbry.lighthouse.call('search', [query], callback, undefined, function() {
          handleSearchFailed(tryNum + 1);
        }, lbry.lighthouse._search_timeout);
      }
    }

    lbry.lighthouse.call('search', [query], callback, undefined, function() { handleSearchFailed() }, lbry.lighthouse._search_timeout);
  }
};

lbry.lighthouse.server = lbry.lighthouse.servers[Math.round(Math.random() * (lbry.lighthouse.servers.length - 1))];
