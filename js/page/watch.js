var videoStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#000'
};

var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  updateVideo: function(video, firstRun=true) {
    if (!video.readyState) {
      if (!firstRun) { // On the first run, give the browser's initial load a chance to work
         video.load();
      }
      setTimeout(() => {
        this.updateVideo(video, false);
      }, 3000);
    }
  },
  render: function() {
    return (
      <main>
        <video style={videoStyle} src={"/view?name=" + this.props.name} ref={this.updateVideo} controls></video>
      </main>
    );
  }
});
