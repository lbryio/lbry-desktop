import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {FileActions} from 'component/file-actions.js';
import {Thumbnail, TruncatedText, FilePrice} from 'component/common.js';
import UriIndicator from 'component/channel-indicator.js';

/*should be merged into FileTile once FileTile is refactored to take a single id*/
export let FileTileStream = React.createClass({
  _fileInfoSubscribeId: null,
  _isMounted: null,

  propTypes: {
    uri: React.PropTypes.string,
    metadata: React.PropTypes.object,
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
    if (this.state.isHidden) {
      return null;
    }

    const uri = lbryuri.normalize(this.props.uri);
    const metadata = this.props.metadata;
    const isConfirmed = !!metadata;
    const title = isConfirmed ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;
    const primaryUrl = "?show=" + uri;
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <a href={primaryUrl} className="card__link">
          <div className={"card__inner file-tile__row"}>
            <div className="card__media"
                 style={{ backgroundImage: "url('" + (metadata && metadata.thumbnail ? metadata.thumbnail : lbry.imagePath('default-thumb.svg')) + "')" }}>
            </div>
            <div className="file-tile__content">
              <div className="card__title-primary">
                { !this.props.hidePrice
                  ? <FilePrice uri={this.props.uri} />
                  : null}
                <div className="meta">{uri}</div>
                <h3><TruncatedText lines={1}>{title}</TruncatedText></h3>
              </div>
              <div className="card__content card__subtext">
                <TruncatedText lines={3}>
                  {isConfirmed
                    ? metadata.description
                    : <span className="empty">This file is pending confirmation.</span>}
                </TruncatedText>
              </div>
            </div>
          </div>
        </a>
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

export let FileCardStream = React.createClass({
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
    this.setState({
      hovered: true,
    });
  },
  handleMouseOut: function() {
    this.setState({
      hovered: false,
    });
  },
  render: function() {
    if (this.state.isHidden) {
      return null;
    }

    const uri = lbryuri.normalize(this.props.uri);
    const metadata = this.props.metadata;
    const isConfirmed = !!metadata;
    const title = isConfirmed ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;
    const primaryUrl = '?show=' + uri;
    return (
      <section className={ 'card card--small card--link ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="card__inner">
          <a href={primaryUrl} className="card__link">
            <div className="card__title-identity">
              <h5 title={title}><TruncatedText lines={1}>{title}</TruncatedText></h5>
              <div className="card__subtitle">
                { !this.props.hidePrice ? <span style={{float: "right"}}><FilePrice uri={this.props.uri} metadata={metadata} /></span>  : null}
                <UriIndicator uri={uri} metadata={metadata} contentType={this.props.contentType}
                              hasSignature={this.props.hasSignature} signatureIsValid={this.props.signatureIsValid} />
              </div>
            </div>
            <div className="card__media" style={{ backgroundImage: "url('" + metadata.thumbnail + "')" }}></div>
            <div className="card__content card__subtext card__subtext--two-lines">
                <TruncatedText lines={2}>
                  {isConfirmed
                    ? metadata.description
                    : <span className="empty">This file is pending confirmation.</span>}
                </TruncatedText>
            </div>
          </a>
          {this.state.showNsfwHelp && this.state.hovered
            ? <div className='card-overlay'>
             <p>
               This content is Not Safe For Work.
               To view adult content, please change your <Link className="button-text" href="?settings" label="Settings" />.
             </p>
           </div>
            : null}
        </div>
      </section>
    );
  }
});

let FileTile = React.createClass({
  _isMounted: false,
  _isResolvePending: false,

  propTypes: {
    uri: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      outpoint: null,
      claimInfo: null
    }
  },
  resolve: function(uri) {
    this._isResolvePending = true;
    lbry.resolve({uri: uri}).then((resolutionInfo) => {
      this._isResolvePending = false;
      if (this._isMounted && resolutionInfo && resolutionInfo.claim && resolutionInfo.claim.value &&
        resolutionInfo.claim.value.stream && resolutionInfo.claim.value.stream.metadata) {
        // In case of a failed lookup, metadata will be null, in which case the component will never display
        this.setState({
          claimInfo: resolutionInfo.claim,
        });
      }
    });
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.uri != this.props.uri) {
      this.setState(this.getInitialState());
      this.resolve(nextProps.uri);
    }
  },
  componentDidMount: function() {
    this._isMounted = true;
    this.resolve(this.props.uri);
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (!this.state.claimInfo) {
      if (this.props.displayStyle == 'card') {
        return <FileCardStream outpoint={null} metadata={{title: this.props.uri, description: "Loading..."}} contentType={null} hidePrice={true}
                               hasSignature={false} signatureIsValid={false} uri={this.props.uri} />
      }
      if (this.props.showEmpty)
      {
        return this._isResolvePending ?
           <BusyMessage message="Loading magic decentralized data" /> :
           <div className="empty">{lbryuri.normalize(this.props.uri)} is unclaimed. <Link label="Put something here" href="?publish" /></div>;
      }
      return null;
    }

    const {txid, nout, has_signature, signature_is_valid,
           value: {stream: {metadata, source: {contentType}}}} = this.state.claimInfo;

    return this.props.displayStyle == 'card' ?
           <FileCardStream outpoint={txid + ':' + nout} metadata={metadata} contentType={contentType}
              hasSignature={has_signature} signatureIsValid={signature_is_valid} {... this.props}/> :
          <FileTileStream outpoint={txid + ':' + nout} metadata={metadata} contentType={contentType}
          hasSignature={has_signature} signatureIsValid={signature_is_valid} {... this.props} />;
  }
});