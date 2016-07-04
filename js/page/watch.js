var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      downloadStarted: false,
      readyToPlay: false,
      loadStatusMessage: "Requesting stream",
      mimeType: null,
    };
  },
  componentDidMount: function() {
    lbry.getStream(this.props.name);
    this.updateLoadStatus();
  },
  updateLoadStatus: function() {
    lbry.getFileStatus(this.props.name, (status) => {
      if (!status || status.code != 'running' || status.written_bytes == 0) {
        // Download hasn't started yet, so update status message (if available) then try again
        if (status) {
          this.setState({
            loadStatusMessage: status.message
          });
        }
        setTimeout(() => { this.updateLoadStatus() }, 250);
      } else {
        this.setState({
          readyToPlay: true,
          mimeType: status.mime_type,
        })
        var player = new MediaElementPlayer(this.refs.player, {
          mode: 'shim', // Force Flash (for now)
          setDimensions: false,
        });
      }
    });
  },
  render: function() {
    return (
      <main className="page full-screen">
      <div className={this.state.readyToPlay ? 'hidden' : ''}>
        <h3>Loading lbry://{this.props.name}</h3>
        {this.state.loadStatusMessage}...
      </div>
      <video ref="player" width="100%" height="100%">
        <source type={this.state.mimeType == 'audio/m4a' ? 'video/mp4' : this.state.mimeType} src={'/view?name=' + this.props.name} />
      </video>
      </main>
    );
  }
});
