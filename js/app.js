var appStyles = {
  width: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
};
var App = React.createClass({
  getInitialState: function() {
    return {
      viewingPage: window.location.search === '?settings' ? 'settings' : 'home'
    }
  },
  componentWillMount: function() {
    lbry.checkNewVersionAvailable(function(isAvailable) {
      if (isAvailable) {
        alert("The version of LBRY you're using is not up to date.\n\n" +
              "You'll now be taken to lbry.io, where you can download the latest version.");
        window.location = "http://www.lbry.io/" + (navigator.userAgent.indexOf('Mac OS X') != -1 ? 'osx' : 'linux');
      }
    });
  },
  componentDidMount: function() {
    lbry.getStartNotice(function(notice) {
      if (notice) {
        alert(notice);
      }
    });
  },
  render: function() {
    if (this.state.viewingPage == 'home') {
      var content = <HomePage />;
    } else if (this.state.viewingPage == 'settings') {
      var content = <SettingsPage />;
    }
    return (
      <div style={appStyles}>
        {content}
      </div>
    );
  }
});