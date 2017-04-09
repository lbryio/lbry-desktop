import React from 'react';
import lbry from '../lbry.js';
import Link from 'component/link';
import {FileActions} from '../component/file-actions.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';
import ChannelIndicator from '../component/channel-indicator.js';

let FilePrice = React.createClass({
  _isMounted: false,

  propTypes: {
    uri: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      cost: null,
      costIncludesData: null,
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.getCostInfoForName(this.props.uri, ({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      }
    }, () => {
      // If we get an error looking up cost information, do nothing
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
  _metadata: null,

  propTypes: {
    uri: React.PropTypes.string,
    claimInfo: React.PropTypes.object,
    outpoint: React.PropTypes.string,
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
    const {value: {stream: {metadata, source: {contentType}}}} = this.props.claimInfo;
    this._metadata = metadata;
    this._contentType = contentType;
  },
  componentDidMount: function() {
    this._isMounted = true;
    if (this.props.hideOnRemove) {
      this._fileInfoSubscribeId = lbry.fileInfoSubscribe(this.props.outpoint, this.onFileInfoUpdate);
    }
  },
  componentWillUnmount: function() {
    if (this._fileInfoSubscribeId) {
      lbry.fileInfoUnsubscribe(this.props.outpoint, this._fileInfoSubscribeId);
    }
  },
  onFileInfoUpdate: function(fileInfo) {
    if (!fileInfo && this._isMounted && this.props.hideOnRemove) {
      this.setState({
        isHidden: true
      });
    }
  },
  handleMouseOver: function() {
    if (this.props.obscureNsfw && this.props.metadata && this._metadata.nsfw) {
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
    if (this.state.isHidden) {
      return null;
    }

    const metadata = this._metadata;
    const isConfirmed = typeof metadata == 'object';
    const title = isConfirmed ? metadata.title : ('lbry://' + this.props.uri);
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className={"row-fluid card-content file-tile__row"}>
          <div className="span3">
            <a href={'?show=' + this.props.uri}><Thumbnail className="file-tile__thumbnail" src={metadata.thumbnail} alt={'Photo for ' + (title || this.props.uri)} /></a>
          </div>
          <div className="span9">
            { !this.props.hidePrice
              ? <FilePrice uri={this.props.uri} />
              : null}
            <div className="meta"><a href={'?show=' + this.props.uri}>{'lbry://' + this.props.uri}</a></div>
            <h3 className="file-tile__title">
              <a href={'?show=' + this.props.uri}>
                <TruncatedText lines={1}>
                  {title}
                </TruncatedText>
              </a>
            </h3>
            <ChannelIndicator uri={this.props.uri} claimInfo={this.props.claimInfo} />
            <FileActions uri={this.props.uri} outpoint={this.props.outpoint} metadata={metadata} contentType={this._contentType} />
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {isConfirmed
                   ? metadata.description
                   : <span className="empty">This file is pending confirmation.</span>}
              </TruncatedText>
            </p>
          </div>
        </div>
        {this.state.showNsfwHelp
          ? <div className='card-overlay'>
           <p>
             This content is Not Safe For Work.
             To view adult content, please change your <Link className="button-text" href="?settings" label="Settings" />.
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
    uri: React.PropTypes.string.isRequired,
    available: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      outpoint: null,
      claimInfo: null
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.resolve({uri: this.props.uri}).then(({claim: claimInfo}) => {
      const {value: {stream: {metadata}}, txid, nout} = claimInfo;
      if (this._isMounted && claimInfo.value.stream.metadata) {
        // In case of a failed lookup, metadata will be null, in which case the component will never display
        this.setState({
          outpoint: txid + ':' + nout,
          claimInfo: claimInfo,
        });
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (!this.state.claimInfo || !this.state.outpoint) {
      return null;
    }

    return <FileTileStream outpoint={this.state.outpoint} claimInfo={this.state.claimInfo}
                           {... this.props} uri={this.props.uri}/>;
  }
});
