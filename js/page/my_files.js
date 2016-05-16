var removeIconColumnStyle = {
  fontSize: '1.3em',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
progressBarStyle = {
  height: '15px',
  width: '230px',
  backgroundColor: '#444',
  border: '2px solid #eee',
  display: 'inline-block',
};

var MyFilesRow = React.createClass({
  onRemoveClicked: function() {
     var alertText = 'Are you sure you\'d like to remove "' + this.props.title + '?" This will ' +
                     (this.completed ? ' stop the download and ' : '') +
                     'permanently remove the file from your system.';

    if (confirm(alertText)) {
      lbry.deleteFile(this.props.lbryUri);
    }
  },
  onPauseResumeClicked: function() {
    if (this.props.stopped) {
      lbry.startFile(this.props.lbryUri);
    } else {
      lbry.stopFile(this.props.lbryUri);
    }
  },
  render: function() {
    if (this.props.completed) {
      var pauseLink = null;
      var curProgressBarStyle = {display: 'none'};
    } else {
      var pauseLink = <Link icon={this.props.stopped ? 'icon-play' : 'icon-pause'}
                            label={this.props.stopped ? 'Resume download' : 'Pause download'}
                            onClick={() => { this.onPauseResumeClicked() }} />;

      var curProgressBarStyle = Object.assign({}, progressBarStyle);
      curProgressBarStyle.width = this.props.ratioLoaded * 230;
      curProgressBarStyle.borderRightWidth = 230 - (this.props.ratioLoaded * 230) + 2;    
    }
    return (
      <div className="row-fluid">
        <div className="span3">
          <img src={this.props.imgUrl} style={searchRowImgStyle} alt={'Photo for ' + (this.props.title || this.props.name)} style={searchRowImgStyle} />
        </div>
        <div className="span6">
          <h2>{this.props.title}</h2>
          <div className={this.props.completed ? 'hidden' : ''} style={curProgressBarStyle}></div>
          { ' ' }
          {this.props.completed ? 'Download complete' : (parseInt(this.props.ratioLoaded * 100) + '%')}
          <div>{ pauseLink }</div>
        </div>
        <div className="span1" style={removeIconColumnStyle}>
          <Link icon="icon-close" title="Remove file" onClick={() => { this.onRemoveClicked() } } /><br />
        </div>
      </div>
    );
  }
});

var MyFilesPage = React.createClass({
  getInitialState: function() {
    return {
      filesInfo: null,
    };
  },
  componentWillMount: function() {
    this.updateFilesInfo();
  },
  updateFilesInfo: function() {
    lbry.getFilesInfo((filesInfo) => {
      this.setState({
        filesInfo: (filesInfo ? filesInfo : []),
      });
      setTimeout(() => { this.updateFilesInfo() }, 1000);
    });
  },
  render: function() {
    if (this.state.filesInfo === null) {
      return null;
    } else {
      if (this.state.filesInfo.length == 0) {
        var content = <span>You haven't downloaded anything from LBRY yet. Go <Link href="/" label="search for your first download" />!</span>;
      } else {
        var content = [];
        for (let {completed, written_bytes, total_bytes, lbry_uri, stopped, metadata} of this.state.filesInfo) {
          let {name, thumbnail} = metadata;
          content.push(<MyFilesRow lbryUri={lbry_uri} title={name} completed={completed} stopped={stopped}
                                   ratioLoaded={written_bytes / total_bytes} imgUrl={thumbnail}/>);
        }
      }
      return (
        <main>
        <h1>My files</h1>
        {content}
        <section>
          <Link href="/" label="<< Return" />
        </section>
        </main>
      );
    }
  }
});