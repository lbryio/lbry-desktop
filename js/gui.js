

//main.js
var init = function() {
  var canvas = document.getElementById('canvas');

  ReactDOM.render(
    <SplashScreen message="Connecting"/>,
    canvas
  );

  lbry.connect(function() {
    ReactDOM.render(<App/>, canvas);
  })
};

init();