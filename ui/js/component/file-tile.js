import React from 'react';
import lbry from '../lbry.js';
import uri from '../uri.js';
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

    lbry.getCostInfo(this.props.uri, ({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      }
    }, (err) => {
      console.log('error from getCostInfo callback:', err)
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

  propTypes: {
    uri: React.PropTypes.string,
    metadata: React.PropTypes.object.isRequired,
    contentType: React.PropTypes.string.isRequired,
    outpoint: React.PropTypes.string,
    hasSignature: React.PropTypes.bool,
    signatureIsValid: React.PropTypes.bool,
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
      hidePrice: false,
      hasSignature: false,
    }
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
    console.log('rendering.')
    if (this.state.isHidden) {
      console.log('hidden, so returning null')
      return null;
    }

    console.log("inside FileTileStream. metadata is", this.props.metadata)

    const lbryUri = uri.normalizeLbryUri(this.props.uri);
    const metadata = this.props.metadata;
    const isConfirmed = typeof metadata == 'object';
    const title = isConfirmed ? metadata.title : lbryUri;
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className={"row-fluid card-content file-tile__row"}>
          <div className="span3">
            <a href={'?show=' + lbryUri}><Thumbnail className="file-tile__thumbnail" src={metadata.thumbnail} alt={'Photo for ' + (title || this.props.uri)} /></a>
          </div>
          <div className="span9">
            { !this.props.hidePrice
              ? <FilePrice uri={this.props.uri} />
              : null}
            <div className="meta"><a href={'?show=' + this.props.uri}>{lbryUri}</a></div>
            <h3 className="file-tile__title">
              <a href={'?show=' + this.props.uri}>
                <TruncatedText lines={1}>
                  {title}
                </TruncatedText>
              </a>
            </h3>
            <ChannelIndicator uri={lbryUri} metadata={metadata} contentType={this.props.contentType}
                              hasSignature={this.props.hasSignature} signatureIsValid={this.props.signatureIsValid} />
            <FileActions uri={this.props.uri} outpoint={this.props.outpoint} metadata={metadata} contentType={this.props.contentType} />
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
      if (this._isMounted && claimInfo.value.stream.metadata) {
        // In case of a failed lookup, metadata will be null, in which case the component will never display
        this.setState({
          claimInfo: claimInfo,
        });
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (!this.state.claimInfo) {
      return null;
    }

    const {txid, nout, has_signature, signature_is_valid,
           value: {stream: {metadata, source: {contentType}}}} = this.state.claimInfo;
    return <FileTileStream outpoint={txid + ':' + nout} metadata={metadata} contentType={contentType}
                           hasSignature={has_signature} signatureIsValid={signature_is_valid} {... this.props} />;
  }
});
