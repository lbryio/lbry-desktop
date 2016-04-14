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
  marginTop: '24px'
};

var SplashScreen = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
    onLoadDone: React.PropTypes.func,
  },
  componentDidMount: function() {
    lbry.connect(this.props.onLoadDone);
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
        </div>
      </div>
    );
  }
});