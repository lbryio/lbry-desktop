//main.js
var init = function() {
  var canvas = document.getElementById('canvas');

  ReactDOM.render(
    <SplashScreen message="Connecting" onLoadDone={function() {
      // On home page, if the balance is 0, display claim code page instead of home page.
      // Find somewhere better for this logic
      if (window.location.search == '' || window.location.search == '?' || window.location.search == 'discover') {
        lbry.getBalance((balance) => {
          if (balance <= 0) {
            window.location.href = '?claim';
          } else {
            ReactDOM.render(<App/>, canvas);
          }
        });
      } else {
        ReactDOM.render(<App/>, canvas);
      }
    }}/>,
    canvas
  );
};

init();
