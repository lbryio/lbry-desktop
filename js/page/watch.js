var videoStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#000'
};

var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      readyToPlay: false,
      loadStatusMessage: "Requesting stream",
    };
  },
  componentDidMount: function() {
    lbry.getStream(this.props.name);
    this.updateLoadStatus();
  },
  updateLoadStatus: function() {
    lbry.getFileStatus(this.props.name, (status) => {
      if (status.code != 'running') {
        this.loadStatusMessage = status.message;
        setTimeout(() => { this.updateLoadStatus() }, 250);
      } else {
        this.setState({
          readyToPlay: true
        });
      }
    });
  },
  render: function() {
    if (!this.state.readyToPlay) {
      return (
        <main>
        <h3>Loading lbry://{this.props.name}</h3>
        {this.state.loadStatusMessage}
        </main>
      );
    } else {
      return (
        <main>
        <video style={videoStyle} src={"/view?name=" + this.props.name} controls />;
        </main>
      );
    }
  }
});
