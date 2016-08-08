var moreMenuStyle = {
  position: 'absolute',
  display: 'block',
  top: '26px',
  left: '-13px',
};
var MyFilesRowMoreMenu = React.createClass({
  onRevealClicked: function() {
    lbry.revealFile(this.props.path);
  },
  onRemoveClicked: function() {
    lbry.deleteFile(this.props.lbryUri, false);
  },
  onDeleteClicked: function() {
    var alertText = 'Are you sure you\'d like to delete "' + this.props.title + '?" This will ' +
      (this.completed ? ' stop the download and ' : '') +
      'permanently remove the file from your system.';

    if (confirm(alertText)) {
      lbry.deleteFile(this.props.lbryUri);
    }
  },
  render: function() {
    return (
      <div style={moreMenuStyle}>
        <Menu {...this.props}>
          <MenuItem onClick={this.onRevealClicked} label="Reveal file" /> {/* @TODO: Switch to OS specific wording */}
          <MenuItem onClick={this.onRemoveClicked} label="Remove from LBRY" />
          <MenuItem onClick={this.onDeleteClicked} label="Remove and delete file" />
        </Menu>
      </div>
    );
  }
});

var moreButtonColumnStyle = {
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonContainerStyle = {
    display: 'block',
    position: 'relative',
  },
  moreButtonStyle = {
    fontSize: '1.3em',
  },
  progressBarStyle = {
    height: '15px',
    width: '230px',
    backgroundColor: '#444',
    border: '2px solid #eee',
    display: 'inline-block',
  },
  artStyle = {
    maxHeight: '100px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
var MyFilesRow = React.createClass({
  onPauseResumeClicked: function() {
    if (this.props.stopped) {
      lbry.startFile(this.props.lbryUri);
    } else {
      lbry.stopFile(this.props.lbryUri);
    }
  },
  render: function() {
    //@TODO: Convert progress bar to reusable component

    var progressBarWidth = 230;

    if (this.props.completed) {
      var pauseLink = null;
      var curProgressBarStyle = {display: 'none'};
    } else {
      var pauseLink = <Link icon={this.props.stopped ? 'icon-play' : 'icon-pause'}
                            label={this.props.stopped ? 'Resume download' : 'Pause download'}
                            onClick={() => { this.onPauseResumeClicked() }} />;

      var curProgressBarStyle = Object.assign({}, progressBarStyle);
      curProgressBarStyle.width = Math.floor(this.props.ratioLoaded * progressBarWidth) + 'px';
      curProgressBarStyle.borderRightWidth = progressBarWidth - Math.ceil(this.props.ratioLoaded * progressBarWidth) + 2;
    }

    if (this.props.showWatchButton) {
      var watchButton = <WatchLink streamName={this.props.lbryUri} />
    } else {
      var watchButton = null;
    }

    return (
      <div className="row-fluid">
        <div className="span3">
          {this.props.imgUrl ? <img src={this.props.imgUrl} alt={'Photo for ' + this.props.title} style={artStyle} /> : null}
        </div>
        <div className="span6">
          <h2>{this.props.pending ? this.props.title : <a href={'/?show=' + this.props.lbryUri}>{this.props.title}</a>}</h2>
          {this.props.pending ? <em>This file is pending confirmation</em>
            : (
             <div>
               <div className={this.props.completed ? 'hidden' : ''} style={curProgressBarStyle}></div>
               { ' ' }
               {this.props.completed ? 'Download complete' : (parseInt(this.props.ratioLoaded * 100) + '%')}
               <div>{ pauseLink }</div>
               <div>{ watchButton }</div>
             </div>
           )
          }
        </div>
        <div className="span1" style={moreButtonColumnStyle}>
          {this.props.pending ? null :
           <div style={moreButtonContainerStyle}>
             <Link style={moreButtonStyle} ref="moreButton" icon="icon-ellipsis-h" title="More Options" />
             <MyFilesRowMoreMenu toggleButton={this.refs.moreButton} title={this.props.title}
                                 lbryUri={this.props.lbryUri} fileName={this.props.fileName}
                                 path={this.props.path}/>
           </div>
          }
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
  componentDidMount: function() {
    document.title = "My Files";
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
    }

    if (!this.state.filesInfo.length) {
      var content = <span>You haven't downloaded anything from LBRY yet. Go <Link href="/" label="search for your first download" />!</span>;
    } else {
      var content = [],
          seenUris = {};

      for (let fileInfo of this.state.filesInfo) {
        let {completed, written_bytes, total_bytes, lbry_uri, file_name, download_path,
          stopped, metadata} = fileInfo;

        if (!metadata || seenUris[lbry_uri])
        {
          continue;
        }

        seenUris[lbry_uri] = true;

        let {title, thumbnail} = metadata;

        if (!fileInfo.pending && typeof metadata == 'object') {
          var {title, thumbnail} = metadata;
          var pending = false;
        } else {
          var title = null;
          var thumbnail = null;
          var pending = true;
        }

        var ratioLoaded = written_bytes / total_bytes;
        var showWatchButton = (lbry.getMediaType(file_name) == 'video' || lbry.getMediaType(file_name) == 'audio');

        content.push(<MyFilesRow key={lbry_uri} lbryUri={lbry_uri} title={title || ('lbry://' + lbry_uri)} completed={completed} stopped={stopped}
                                 ratioLoaded={ratioLoaded} imgUrl={thumbnail} path={download_path}
                                 showWatchButton={showWatchButton} pending={pending} />);
      }
    }
    return (
      <main className="page">
        <section>
          {content}
        </section>
      </main>
    );
  }
});
