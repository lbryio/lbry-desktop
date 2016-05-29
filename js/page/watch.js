var videoStyle = {
  width: '100%',
//  height: '100%',
  backgroundColor: '#000'
};

var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      downloadStarted: false,
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
          readyToPlay: true
        })
        flowplayer('player', 'js/flowplayer/flowplayer-3.2.18.swf');
      }
    });
  },
  render: function() {
    return (
      <main className="page full-width">
      <div className={this.state.readyToPlay ? 'hidden' : ''}>
        <h3>Loading lbry://{this.props.name}</h3>
        {this.state.loadStatusMessage}...
      </div>
      <a id="player" href={"/view?name=" + this.props.name} style={videoStyle} />
      </main>
    );
  }
});
