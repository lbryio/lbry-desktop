import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {FileActions} from 'component/file-actions.js';
import {Thumbnail, TruncatedText, FilePrice} from 'component/common.js';
import UriIndicator from 'component/channel-indicator.js';

const FileCardStream = React.createClass({
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
    const primaryUrl = 'show=' + uri;
    return (
      <section className={ 'card card--small card--link ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="card__inner">
          <a href="#" onClick={() => this.props.navigate(primaryUrl)} className="card__link">
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

export default FileCardStream
