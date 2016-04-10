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
  setPage: function(page) {
    this.setState({
      viewingPage: page
    });
  },
  render: function() {
    if (this.state.viewingPage == 'home') {
      var content = <HomePage setPage={this.setPage}/>;
    } else if (this.state.viewingPage == 'settings') {
      var content = <SettingsPage closeCallback={this.setPage.bind(this, 'home')} setPage={this.setPage} />;
    }
    return (
      <div style={appStyles}>
        {content}
      </div>
    );
  }
});