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

    callback(method_output.result);
  });
  xhr.open('POST', 'http://localhost:5279/lbryapi', true);
  xhr.send(JSON.stringify({
    'jsonrpc': '2.0',
    'method': method,
    'params': params,
    'id': 0
  }));
}

//core
lbry.connect = function(callback)
{
  //dummy connect function - one of the first things we should do is dump people to get help if it can't connect
  setTimeout(function() {
    lbry.isConnected = true;
    callback();
  }, 1500);
}

lbry.getBalance = function(callback)
{
  lbry.call("get_balance", {}, callback);
}

lbry.search = function(query, callback)
{
  //simulate searching via setTimeout with
  setTimeout(function() {
    lbry.call("search_nametrie", { query: query }, callback);
  }, 300);
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
