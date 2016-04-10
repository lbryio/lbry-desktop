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