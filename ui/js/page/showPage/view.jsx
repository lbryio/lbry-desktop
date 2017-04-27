import React from 'react';
import lbry from 'lbry.js';
import lighthouse from 'lighthouse.js';
import lbryuri from 'lbryuri.js';
import Video from 'component/video'
import {
  TruncatedText,
  Thumbnail,
  FilePrice,
  BusyMessage
} from 'component/common.js';
import {FileActions} from 'component/file-actions.js';
import Link from 'component/link';
import UriIndicator from 'component/channel-indicator.js';

const FormatItem = (props) => {
  const {
    contentType,
    metadata,
    metadata: {
      thumbnail,
      author,
      title,
      description,
      language,
      license,
    },
    cost,
    uri,
    outpoint,
    costIncludesData,
  } = props
  const mediaType = lbry.getMediaType(contentType);

  return (
    <table className="table-standard">
      <tbody>
        <tr>
          <td>Content-Type</td><td>{contentType}</td>
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
  )
}

let ChannelPage = React.createClass({
  render: function() {
    return <main className="main--single-column">
      <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{this.props.title}</h1></div>
        </div>
        <div className="card__content">
          <p>
            This channel page is a stub.
          </p>
        </div>
      </section>
    </main>
  }
});

let FilePage = React.createClass({
  _isMounted: false,

  propTypes: {
    uri: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      cost: null,
      costIncludesData: null,
      isDownloaded: null,
    };
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.outpoint != this.props.outpoint || nextProps.uri != this.props.uri) {
      this.loadCostAndFileState(nextProps.uri, nextProps.outpoint);
    }
  },

  componentWillMount: function() {
    this._isMounted = true;
    this.loadCostAndFileState(this.props.uri, this.props.outpoint);
  },

  loadCostAndFileState: function(uri, outpoint) {
    lbry.file_list({outpoint: outpoint}).then((fileInfo) => {
      if (this._isMounted) {
        this.setState({
          isDownloaded: fileInfo.length > 0,
        });
      }
    });

    lbry.getCostInfo(uri).then(({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      }
    });
  },

  render: function() {
    const metadata = this.props.metadata,
      title = metadata ? this.props.metadata.title : this.props.uri,
      uriIndicator = <UriIndicator uri={this.props.uri} hasSignature={this.props.hasSignature} signatureIsValid={this.props.signatureIsValid} />;

    return (
      <main className="main--single-column">
        <section className="show-page-media">
          { this.props.contentType && this.props.contentType.startsWith('video/') ?
            <Video className="video-embedded" uri={this.props.uri} metadata={metadata} outpoint={this.props.outpoint} /> :
            (metadata ? <Thumbnail src={metadata.thumbnail} /> : <Thumbnail />) }
        </section>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              {this.state.isDownloaded === false
                ? <span style={{float: "right"}}><FilePrice uri={this.props.uri} metadata={metadata} /></span>
                : null}
              <h1>{title}</h1>
              <div className="card__subtitle">
                { this.props.channelUri ?
                  <Link href={"?show=" + this.props.channelUri }>{uriIndicator}</Link> :
                  uriIndicator}
              </div>
              <div className="card__actions">
                <FileActions uri={this.props.uri} outpoint={this.props.outpoint} metadata={metadata} contentType={this.props.contentType} />
              </div>
            </div>
            <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
              {metadata.description}
            </div>
          </div>
          { metadata ?
            <div className="card__content">
              <FormatItem metadata={metadata} contentType={this.state.contentType} cost={this.state.cost} uri={this.props.uri} outpoint={this.props.outpoint} costIncludesData={this.state.costIncludesData}  />
            </div> : '' }
          <div className="card__content">
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </div>
        </section>
      </main>
    );
  }
});

let ShowPage = React.createClass({
  _uri: null,
  _isMounted: false,

  propTypes: {
    uri: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      outpoint: null,
      metadata: null,
      contentType: null,
      hasSignature: false,
      claimType: null,
      signatureIsValid: false,
      cost: null,
      costIncludesData: null,
      uriLookupComplete: null,
      isFailed: false,
    };
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.uri != this.props.uri) {
      this.setState(this.getInitialState());
      this.loadUri(nextProps.uri);
    }
  },

  componentWillMount: function() {
    this._isMounted = true;
    this.loadUri(this.props.uri);
  },

  loadUri: function(uri) {
    this._uri = lbryuri.normalize(uri);

    lbry.resolve({uri: this._uri}).then((resolveData) => {
      const isChannel = resolveData && resolveData.claims_in_channel;
      if (!this._isMounted) {
        return;
      }
      if (resolveData) {
        let newState = { uriLookupComplete: true }
        if (!isChannel) {
          let {claim: {txid: txid, nout: nout, has_signature: has_signature, signature_is_valid: signature_is_valid, value: {stream: {metadata: metadata, source: {contentType: contentType}}}}} = resolveData;

          Object.assign(newState, {
            claimType: "file",
            metadata: metadata,
            outpoint: txid + ':' + nout,
            hasSignature: has_signature,
            signatureIsValid: signature_is_valid,
            contentType: contentType
          });


          lbry.setTitle(metadata.title ? metadata.title : this._uri)

        } else {
          let {certificate: {txid: txid, nout: nout, has_signature: has_signature}} = resolveData;
          Object.assign(newState, {
            claimType: "channel",
            outpoint: txid + ':' + nout,
            txid: txid,
            metadata: {
              title:resolveData.certificate.name
            }
          });
        }

        this.setState(newState);

      } else {
        this.setState(Object.assign({}, this.getInitialState(), {
          uriLookupComplete: true,
          isFailed: true
        }));
      }
    });
  },

  render: function() {
    const metadata = this.state.metadata,
      title = metadata ? this.state.metadata.title : this._uri;

    let innerContent = "";

    if (!this.state.uriLookupComplete || this.state.isFailed) {
      innerContent = <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{title}</h1></div>
        </div>
        <div className="card__content">
          { this.state.uriLookupComplete ?
            <p>This location is not yet in use. { ' ' }<Link href="?publish" label="Put something here" />.</p> :
            <BusyMessage message="Loading magic decentralized data..." />
          }
        </div>
      </section>;
    } else if (this.state.claimType == "channel") {
      innerContent = <ChannelPage title={this._uri} />
    } else {
      let channelUriObj = lbryuri.parse(this._uri)
      delete channelUriObj.path;
      delete channelUriObj.contentName;
      const channelUri = this.state.signatureIsValid && this.state.hasSignature && channelUriObj.isChannel ? lbryuri.build(channelUriObj, false) : null;
      innerContent = <FilePage
        uri={this._uri}
        channelUri={channelUri}
        outpoint={this.state.outpoint}
        metadata={metadata}
        contentType={this.state.contentType}
        hasSignature={this.state.hasSignature}
        signatureIsValid={this.state.signatureIsValid}
      />;
    }

    return <main className="main--single-column">{innerContent}</main>;
  }
});