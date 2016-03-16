var lbry = {
  isConnected: false,
  rootPath: '.',
  colors: {
    primary: '#155B4A'
  }
};

lbry.call = function(method, params, callback)
{
  /*
   * XHR magic
   */
  //when XHR returns and is successful
  // callback(JSON.parse(xhr.responseText));
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
