import React from 'react';
import lbry from '../lbry.js';
import {Link, ToolTipLink} from '../component/link.js';
import {FileActions} from '../component/file-actions.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';

let FilePrice = React.createClass({
  _isMounted: false,

  propTypes: {
    name: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      cost: null,
      costIncludesData: null,
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      }
    });
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  render: function() {
    if (this.state.cost === null)
    {
      return null;
    }

    return (
      <span className="file-tile__cost">
        <CreditAmount amount={this.state.cost} isEstimate={!this.state.costIncludesData}/>
      </span>
    );
  }
});

/*should be merged into FileTile once FileTile is refactored to take a single id*/
export let FileTileStream = React.createClass({
  _fileInfoSubscribeId: null,
  _isMounted: null,

  propTypes: {
    metadata: React.PropTypes.object,
    sdHash: React.PropTypes.string,
    hideOnRemove: React.PropTypes.bool,
    hidePrice: React.PropTypes.bool,
    obscureNsfw: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      showNsfwHelp: false,
      isHidden: false,
      available: null,
    }
  },
  getDefaultProps: function() {
    return {
      obscureNsfw: !lbry.getClientSetting('showNsfw'),
      hidePrice: false
    }
  },
  componentWillMount: function() {
    if (!('available' in this.props)) {
      lbry.getPeersForBlobHash(this.props.sdHash, (peers) => {
        this.setState({
          available: peers.length > 0,
        });
      });
    }
  },
  componentDidMount: function() {
    this._isMounted = true;
    if (this.props.hideOnRemove) {
      lbry.fileInfoSubscribe(this.props.sdHash, this.onFileInfoUpdate);
    }
  },
  componentWillUnmount: function() {
    if (this._fileInfoSubscribeId) {
      lbry.fileInfoUnsubscribe(this.props.sdHash, this._fileInfoSubscribeId);
    }
  },
  isAvailable: function() {
    return 'available' in this.props ? this.props.available : this.state.available;
  },
  onFileInfoUpdate: function(fileInfo) {
    if (!fileInfo && this._isMounted && this.props.hideOnRemove) {
      this.setState({
        isHidden: true
      });
    }
  },
  handleMouseOver: function() {
    if (this.props.obscureNsfw && this.props.metadata && this.props.metadata.nsfw) {
      this.setState({
        showNsfwHelp: true,
      });
    }
  },
  handleMouseOut: function() {
    if (this.state.showNsfwHelp) {
      this.setState({
        showNsfwHelp: false,
      });
    }
  },
  render: function() {
    if (this.state.isHidden || (!lbry.getClientSetting('showUnavailable') && !this.isAvailable())) {
      return null;
    }

    const metadata = this.props.metadata || {},
          obscureNsfw = this.props.obscureNsfw && metadata.nsfw,
          title = metadata.title ? metadata.title : ('lbry://' + this.props.name),
          showUnavailable = this.isAvailable() === false,
          unavailableMessage = ("The content on LBRY is hosted by its users. It appears there are no " +
                                "users connected that have this file at the moment.");
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        {showUnavailable
          ? <div className='file-tile__not-available-message'>
              This file is not currently available. <ToolTipLink label="Why?" tooltip={unavailableMessage} className="not-available-tooltip-link" />
            </div>
          : null}
        <div className={"row-fluid card-content file-tile__row" + (showUnavailable ? ' file-tile__row--unavailable' : '')}>
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail className="file-tile__thumbnail" src={metadata.thumbnail} alt={'Photo for ' + (title || this.props.name)} /></a>
          </div>
          <div className="span9">
            { !this.props.hidePrice
              ? <FilePrice name={this.props.name} />
              : null}
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 className="file-tile__title">
              <a href={'/?show=' + this.props.name}>
                <TruncatedText lines={1}>
                  {title}
                </TruncatedText>
              </a>
            </h3>
            <FileActions streamName={this.props.name} sdHash={this.props.sdHash} metadata={metadata} />
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {metadata.description}
              </TruncatedText>
            </p>
          </div>
        </div>
        {this.state.showNsfwHelp
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

export let FileTile = React.createClass({
  _isMounted: false,

  propTypes: {
    name: React.PropTypes.string.isRequired,
    available: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      sdHash: null,
      metadata: null
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.resolveName(this.props.name, (metadata) => {
      if (this._isMounted) {
        this.setState({
          sdHash: metadata.sources.lbry_sd_hash,
          metadata: metadata,
        });
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (!this.state.metadata || !this.state.sdHash) {
      return null;
    }

    return <FileTileStream sdHash={this.state.sdHash} metadata={this.state.metadata} {... this.props} />;
  }
});