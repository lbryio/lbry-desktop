import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import uri from '../uri.js';
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
    };
  },
  componentWillMount: function() {
    this._uri = uri.normalizeLbryUri(this.props.uri);
    document.title = this._uri;

    lbry.resolve({uri: this._uri}).then(({ claim: {txid, nout, has_signature, signature_is_valid, value: {stream: {metadata, source: {contentType}}}}}) => {
      console.log({txid, nout, claim: {value: {stream: {metadata, source: {contentType}}}}} );
      this.setState({
        outpoint: txid + ':' + nout,
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
    if (this.state.metadata == null) {
      return null;
    }

    //                  <div className="card__media" style={{ backgroundImage: "url('" + metadata.thumbnail + "')" }}></div>

    const
      metadata = this.state.uriLookupComplete ? this.state.metadata : null,
      title = this.state.uriLookupComplete ? metadata.title : this._uri;

    console.log(metadata);
    return (
      <main className="constrained-page">
        <section className="show-page-media">
          { this.props.contentType && this.props.contentType.startsWith('video/') ?
              <Video className="video-embedded" uri={this._uri} /> :
              <Thumbnail src={metadata.thumbnail} /> }
        </section>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              <span style={{float: "right"}}><FilePrice uri={this._uri} metadata={metadata} /></span>
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
              : <BusyMessage message="Loading..." /> }
          </div>
          <div className="card__content">
            <FormatItem metadata={metadata} contentType={this.state.contentType} cost={this.state.cost} uri={this._uri} outpoint={this.state.outpoint} costIncludesData={this.state.costIncludesData}  />
          </div>
          <div className="card__content">
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </div>
        </section>
      </main>
    );
  }
});

export default ShowPage;
