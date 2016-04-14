//main.js
var init = function() {
  var canvas = document.getElementById('canvas');

  ReactDOM.render(
    <SplashScreen message="Connecting" onLoadDone={function() {
      ReactDOM.render(<App/>, canvas);
    }}/>,
    canvas
  );
};

init();
