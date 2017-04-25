import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {
  FileActions
} from 'component/file-actions.js';
import {Thumbnail, TruncatedText, FilePrice} from 'component/common.js';
import UriIndicator from 'component/channel-indicator.js';

/*should be merged into FileTile once FileTile is refactored to take a single id*/
const FileTileStream = React.createClass({
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
    const { navigate } = this.props
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className={"row-fluid card__inner file-tile__row"}>
          <div className="span3 file-tile__thumbnail-container">
            <a href="#" onClick={() => navigate(`show=${uri}`)}><Thumbnail className="file-tile__thumbnail" {... metadata && metadata.thumbnail ? {src: metadata.thumbnail} : {}} alt={'Photo for ' + this.props.uri} /></a>
          </div>
          <div className="span9">
            <div className="card__title-primary">
              { !this.props.hidePrice
                ? <FilePrice uri={this.props.uri} />
                : null}
              <div className="meta"><a href={'?show=' + this.props.uri}>{uri}</a></div>
              <h3>
                <a href={'?show=' + uri} title={title}>
                  <TruncatedText lines={1}>
                    {title}
                  </TruncatedText>
                </a>
              </h3>
            </div>
            <div className="card__actions">
              <FileActions uri={this.props.uri} outpoint={this.props.outpoint} metadata={metadata} contentType={this.props.contentType} />
            </div>
            <div className="card__content">
              <p className="file-tile__description">
                <TruncatedText lines={2}>
                  {isConfirmed
                    ? metadata.description
                    : <span className="empty">This file is pending confirmation.</span>}
                </TruncatedText>
              </p>
            </div>
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

export default FileTileStream
