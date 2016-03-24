var lbry = {
  isConnected: false,
  rootPath: '.',
  colors: {
    primary: '#155B4A'
  }
};

lbry.call = function (method, params, callback)
{
  var xhr = new XMLHttpRequest;
  xhr.addEventListener('load', function() {
    // The response from the HTTP endpoint has a "result" key containing a JSON string of the output of the JSON-RPC method itself
    var method_output = JSON.parse(JSON.parse(xhr.responseText).result);

    if (method_output.code !== 200) {
        throw new Error('Call to method ' + method + ' failed with message: ' + method_output.message);
    }
    console.log(method_output.result);
    callback(method_output.result);
  });
  xhr.open('POST', 'http://localhost:5279/lbryapi', true);
  xhr.send(JSON.stringify({
    'jsonrpc': '2.0',
    'method': method,
    'params': [params, ],
    'id': 0
  }));
}

//core
lbry.connect = function(callback)
{
  // Check every half second to see if the daemon's running.
  // Returns true to callback once connected, or false if it takes too long and we give up.
  var try_num = 0;
  var check_connected = setInterval(function() {
    lbry.call('is_running', {}, function(is_running) {
      if (is_running) {
        lbry.isConnected = true;
        clearInterval(check_connected);
        callback(true);
      } else {
        if (try_num >= 20) { // Move this into a constant or config option
          clearInterval(check_connected);
          callback(false);
        }
        try_num++;
      }
    });
  }, 500);
}

lbry.getBalance = function(callback)
{
  lbry.call("get_balance", {}, callback);
}

lbry.search = function(query, callback)
{
  lbry.call("search_nametrie", { "search": query }, callback);
}

//utilities
lbry.formatCredits = function(amount, precision)
{
  return amount.toFixed(precision || 1);
}

lbry.loadJs = function(src, type, onload)
{
  var lbryScriptTag = document.getElementById('lbry'),
      newScriptTag = document.createElement('script'),
      type = type || 'text/javascript';
      
  newScriptTag.src = src;
  newScriptTag.type = type;
  if (onload)
  {
    newScript.onload = onload;
  }
  lbryScriptTag.parentNode.insertBefore(newScriptTag, lbryScriptTag);
}

lbry.imagePath = function(file)
{ 
  return lbry.rootPath + '/img/' + file; 
}
