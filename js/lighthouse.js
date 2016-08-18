lbry.lighthouse = {
  servers: [
    'http://lighthouse1.lbry.io:50005',
    'http://lighthouse2.lbry.io:50005',
    'http://lighthouse3.lbry.io:50005',
  ],
  path: '/',

  call: function(method, params, callback, errorCallback, connectFailedCallback) {
    lbry.jsonrpc_call(this.server + this.path, method, params, callback, errorCallback, connectFailedCallback);
  },
};

lbry.lighthouse.server = lbry.lighthouse.servers[Math.round(Math.random() * (lbry.lighthouse.servers.length - 1))];
