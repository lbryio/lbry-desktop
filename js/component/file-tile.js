import React from 'react';
import lbry from '../lbry.js';
import {Link, DownloadLink, WatchLink} from '../component/link.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';

let FileTile = React.createClass({
  _isMounted: false,
  _fileInfoCheckInterval: 5000,

  propTypes: {
    metadata: React.PropTypes.object.isRequired,
    fileInfo: React.PropTypes.string,
    name: React.PropTypes.string,
    sdHash: React.PropTypes.string,
    available: React.PropTypes.bool,
    isMine: React.PropTypes.bool,
    local: React.PropTypes.bool,
    cost: React.PropTypes.number,
    costIncludesData: React.PropTypes.bool,
    hideOnRemove: React.PropTypes.bool,
  },
  updateFileInfo: function(progress=null) {
    const updateFileInfoCallback = ((fileInfo) => {
      if (!this._isMounted || 'fileInfo' in this.props) {
        /**
         * The component was unmounted, or a file info data structure has now been provided by the
         * containing component.
         */
         return;
      }

      this.setState({
        fileInfo: fileInfo || null,
        local: !!fileInfo,
      });

      setTimeout(() => { this.updateFileInfo() }, this._fileInfoCheckInterval);
    });

    if ('sdHash' in this.props) {
      lbry.getFileInfoBySdHash(this.props.sdHash, updateFileInfoCallback);
      this.getIsMineIfNeeded(this.props.sdHash);
    } else if ('name' in this.props) {
      lbry.getFileInfoByName(this.props.name, (fileInfo) => {
        this.getIsMineIfNeeded(fileInfo.sd_hash);

        updateFileInfoCallback(fileInfo);
      });
    } else {
      throw new Error("No progress, stream name or sd hash passed to FileTile");
    }
  },
  getIsMineIfNeeded: function(sdHash) {
    if (this.state.isMine !== null) {
      // The info was already provided by this.props.isMine
      return;
    }

    lbry.getMyClaims((claimsInfo) => {
      for (let {value} of claimsInfo) {
        if (JSON.parse(value).sources.lbry_sd_hash == sdHash) {
          this.setState({
            isMine: true,
          });
          return;
        }
      }

      this.setState({
        isMine: false,
      });
    });
  },
  getInitialState: function() {
    return {
      downloading: false,
      removeConfirmed: false,
      isHovered: false,
      cost: null,
      costIncludesData: null,
      fileInfo: 'fileInfo' in this.props ? this.props.fileInfo : null,
      isMine: 'isMine' in this.props ? this.props.isMine : null,
      local: 'local' in this.props ? this.props.local : null,
    }
  },
  getDefaultProps: function() {
    return {
      compact: false,
      hideOnRemove: false,
    }
  },
  handleMouseOver: function() {
    this.setState({
      isHovered: true,
    });
  },
  handleMouseOut: function() {
    this.setState({
      isHovered: false,
    });
  },
  handleRemoveConfirmed: function() {
    this.setState({
      removeConfirmed: true,
    });
  },
  componentWillMount: function() {
    this.updateFileInfo();

    if ('cost' in this.props) {
      this.setState({
        cost: this.props.cost,
        costIncludesData: this.props.costIncludesData,
      });
    } else {
      lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      });
    }
  },
  componentDidMount: function() {
    this._isMounted = true;
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    // Can't render until we know whether we own the file and if we have a local copy
    if (this.state.isMine === null || this.state.local === null ||
        (this.props.hideOnRemove && this.state.removeConfirmed)) {
      return null;
    }

    const obscureNsfw = !lbry.getClientSetting('showNsfw') && this.props.nsfw;

    let downloadLinkExtraProps = {};
    if (this.state.fileInfo === null) {
      downloadLinkExtraProps.state = 'not-started';
    } else if (!this.state.fileInfo.completed) {
      downloadLinkExtraProps.state = 'downloading';

      const {written_bytes, total_bytes, path} = this.state.fileInfo;
      downloadLinkExtraProps.progress = written_bytes / total_bytes;
    } else {
      downloadLinkExtraProps.state = 'done';
      downloadLinkExtraProps.path = this.state.fileInfo.download_path;
    }

    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') + (this.props.compact ? 'file-tile--compact' : '')} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="row-fluid card-content file-tile__row">
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail className="file-tile__thumbnail" src={this.props.metadata.thumbnail} alt={'Photo for ' + (this.props.metadata.title || this.props.name)} /></a>
          </div>
          <div className="span9">
            {this.state.cost !== null && !this.state.local
              ? <span className="file-tile__cost">
                  <CreditAmount amount={this.state.cost} isEstimate={!this.state.costIncludesData}/>
                </span>
              : null}
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 className={'file-tile__title ' + (this.props.compact ? 'file-tile__title--compact' : '')}>
              <a href={'/?show=' + this.props.name}>
                <TruncatedText lines={3}>
                  {this.props.metadata.title}
                </TruncatedText>
              </a>
            </h3>
            <div>
              {this.props.metadata.content_type.startsWith('video/') ? <WatchLink streamName={this.props.name} button="primary" /> : null}
              {!this.props.isMine
                ? <DownloadLink streamName={this.props.name} metadata={this.props.metadata} button="text"
                                onRemoveConfirmed={this.handleRemoveConfirmed} {... downloadLinkExtraProps}/>
                : null}
             </div>
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {this.props.metadata.description}
              </TruncatedText>
            </p>
          </div>
        </div>
        {obscureNsfw && this.state.isHovered
          ? <div className='card-overlay'>
              <p>
                This content is Not Safe For Work.
                To view adult content, please change your <Link href="?settings" label="Settings" />.
              </p>
            </div>
          : null}
      </section>
    );
  }
});

export default FileTile;