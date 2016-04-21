var videoStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#000'
};

var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  render: function() {
    return (
      <main>
        <video style={videoStyle} src={"/view?name=" + this.props.name} controls></video>
      </main>
    );
  }
});
