var splashStyle = {
  color: 'white',
  backgroundImage: 'url(' + lbry.imagePath('lbry-bg.png') + ')',
  backgroundSize: 'cover',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}, splashMessageStyle = {
  marginTop: '24px',
  width: '325px',
  textAlign: 'center',
};

var SplashScreen = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
    onLoadDone: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      details: 'Starting daemon',
      isLagging: false,
    }
  },
  updateStatus: function(checkNum=0, was_lagging=false) {
      lbry.getDaemonStatus((status) => {
        if (status.code == 'started') {
          this.props.onLoadDone();
          return;
        }

        this.setState({
          details: status.message + (status.is_lagging ? '' : '...'),
          isLagging: status.is_lagging,
        });

        if (checkNum < 600) {
          setTimeout(() => {
            this.updateStatus(checkNum + 1, status.is_lagging);
          }, 500);
        }
      });
  },
  componentDidMount: function() {
    this.updateStatus();
  },
  render: function() {
    var imgSrc = lbry.imagePath('lbry-white-485x160.png');
    return (
      <div className="splash-screen" style={splashStyle}>
        <img src={imgSrc} alt="LBRY"/>
        <div style={splashMessageStyle}>
          <h3>
            {this.props.message}
            <span className="busy-indicator"></span>
          </h3>
          <Icon icon='icon-warning' style={this.state.isLagging ? {} : { display: 'none' }}/> <span style={ this.state.isLagging ? {} : {'color': '#c3c3c3'} }>{this.state.details}</span>
        </div>
      </div>
    );
  }
});