import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import lbryuri from '../lbryuri.js';
import {Video} from '../page/watch.js'
import {TruncatedText, Thumbnail, FilePrice, BusyMessage} from '../component/common.js';
import {FileActions} from '../component/file-actions.js';
import {Link} from '../component/link.js';
import UriIndicator from '../component/channel-indicator.js';

var FormatItem = React.createClass({
  propTypes: {
    metadata: React.PropTypes.object,
    contentType: React.PropTypes.string,
    uri: React.PropTypes.string,
    outpoint: React.PropTypes.string,
  },
  render: function() {
    const {thumbnail, author, title, description, language, license} = this.props.metadata;
    const mediaType = lbry.getMediaType(this.props.contentType);

    return (
      <table className="table-standard">
        <tbody>
          <tr>
            <td>Content-Type</td><td>{this.props.contentType}</td>
          </tr>
          <tr>
            <td>Author</td><td>{author}</td>
          </tr>
          <tr>
            <td>Language</td><td>{language}</td>
          </tr>
          <tr>
            <td>License</td><td>{license}</td>
          </tr>
        </tbody>
      </table>
    );
  }
});

let ShowPage = React.createClass({
  _uri: null,

  propTypes: {
    uri: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      metadata: null,
      contentType: null,
      hasSignature: false,
      signatureIsValid: false,
      cost: null,
      costIncludesData: null,
      uriLookupComplete: null,
      isDownloaded: null,
    };
  },
  componentWillMount: function() {
    this._uri = lbryuri.normalize(this.props.uri);

    lbry.resolve({uri: this._uri}).then(({ claim: {txid, nout, has_signature, signature_is_valid, value: {stream: {metadata, source: {contentType}}}}}) => {
      const outpoint = txid + ':' + nout;

      lbry.file_list({outpoint}).then((fileInfo) => {
        this.setState({
          isDownloaded: fileInfo.length > 0,
        });
      });

      document.title = metadata.title ? metadata.title : this._uri;

      this.setState({
        outpoint: outpoint,
        metadata: metadata,
        hasSignature: has_signature,
        signatureIsValid: signature_is_valid,
        contentType: contentType,
        uriLookupComplete: true,
      });
    });

    lbry.getCostInfo(this._uri).then(({cost, includesData}) => {
      this.setState({
        cost: cost,
        costIncludesData: includesData,
      });
    });
  },
  render: function() {
    const metadata = this.state.metadata;
    const title = metadata ? this.state.metadata.title : this._uri;

    return (
      <main className="constrained-page">
        <section className="show-page-media">
          { this.state.contentType && this.state.contentType.startsWith('video/') ?
              <Video className="video-embedded" uri={this._uri} metadata={metadata} outpoint={this.state.outpoint} /> :
              (metadata ? <Thumbnail src={metadata.thumbnail} /> : <Thumbnail />) }
        </section>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              {this.state.isDownloaded === false
                ? <span style={{float: "right"}}><FilePrice uri={this._uri} metadata={this.state.metadata} /></span>
                : null}
              <h1>{title}</h1>
              { this.state.uriLookupComplete ?
                <div>
                  <div className="card__subtitle">
                    <UriIndicator uri={this._uri} hasSignature={this.state.hasSignature} signatureIsValid={this.state.signatureIsValid} />
                  </div>
                  <div className="card__actions">
                    <FileActions uri={this._uri} outpoint={this.state.outpoint} metadata={metadata} contentType={this.state.contentType} />
                  </div>
                </div> : '' }
            </div>
            { this.state.uriLookupComplete ?
                <div>
                  <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
                    {metadata.description}
                  </div>
                </div>
              : <div className="card__content"><BusyMessage message="Loading magic decentralized data..." /></div> }
          </div>
          { metadata ?
              <div className="card__content">
                <FormatItem metadata={metadata} contentType={this.state.contentType} cost={this.state.cost} uri={this._uri} outpoint={this.state.outpoint} costIncludesData={this.state.costIncludesData}  />
              </div> : '' }
          <div className="card__content">
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </div>
        </section>
      </main>
    );
  }
});

export default ShowPage;
