var lbry = {
  isConnected: false,
  rootPath: '../../web/',
  colors: {
    primary: '#155B4A'
  }
};

//core
lbry.connect = function(callback)
{
  //dummy connect function - one of the first things we should do is dump people to get help if it can't connect
  setTimeout(function() {
    lbry.isConnected = true;
    callback();
  }, 1500);
}

lbry.getBalance = function()
{
  var method = "get_balance";
  var request = new XmlRpcRequest("http://localhost:7080/", method);  
  var amount = Number(request.send().parseXML());
  return amount;
}

lbry.search = function(query, callback)
{
  //simulate searching via setTimeout with
  setTimeout(function() {
      var method = "search_nametrie"
      var request = new XmlRpcRequest("http://localhost:7080/", method);
      request.addParam(query);
      var results = request.send().parseXML();

    callback(results);
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
