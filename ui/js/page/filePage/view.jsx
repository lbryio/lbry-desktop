import React from 'react';
import lbry from 'lbry.js';
import lighthouse from 'lighthouse.js';
import lbryuri from 'lbryuri.js';
import Video from 'component/video'
import {
  TruncatedText,
  Thumbnail,
  BusyMessage,
} from 'component/common';
import FilePrice from 'component/filePrice'
import FileActions from 'component/fileActions';
import Link from 'component/link';
import UriIndicator from 'component/uriIndicator';

const FormatItem = (props) => {
  const {
    contentType,
    metadata: {
      author,
      language,
      license,
    }
  } = props

  const mediaType = lbry.getMediaType(contentType);

  return (
    <table className="table-standard">
      <tbody>
        <tr>
          <td>Content-Type</td><td>{mediaType}</td>
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

const FilePage = (props) => {
  const {
    claim,
    navigate,
    claim: {
      txid,
      nout,
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
      value,
      value: {
        stream,
        stream: {
          metadata,
          source,
          metadata: {
            title,
          } = {},
          source: {
            contentType,
          } = {},
        } = {},
      } = {},
    },
    uri,
    isDownloaded,
    fileInfo,
    costInfo,
    costInfo: {
      cost,
      includesData: costIncludesData,
    } = {},
  } = props

  const outpoint = txid + ':' + nout;
  const uriLookupComplete = !!claim && Object.keys(claim).length

  const channelUriObj = lbryuri.parse(uri)
  delete channelUriObj.path;
  delete channelUriObj.contentName;
  const channelUri = signatureIsValid && hasSignature && channelUriObj.isChannel ? lbryuri.build(channelUriObj, false) : null;
  const uriIndicator = <UriIndicator uri={uri} />

  return (
    <main className="main--single-column">
      <section className="show-page-media">
        { contentType && contentType.startsWith('video/') ?
          <Video className="video-embedded" uri={uri} metadata={metadata} outpoint={outpoint} /> :
          (Object.keys(metadata).length > 0 ? <Thumbnail src={metadata.thumbnail} /> : <Thumbnail />) }
      </section>
      <section className="card">
        <div className="card__inner">
          <div className="card__title-identity">
            {isDownloaded === false
              ? <span style={{float: "right"}}><FilePrice uri={lbryuri.normalize(uri)} /></span>
              : null}
            <h1>{title}</h1>
            <div className="card__subtitle">
              { channelUri ?
                <Link href={"?show=" + channelUri }>{uriIndicator}</Link> :
                uriIndicator}
           </div>
            <div className="card__actions">
              <FileActions uri={uri} /></div>
          </div>
          <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
            {metadata.description}
          </div>
        </div>
        { metadata ?
          <div className="card__content">
            <FormatItem metadata={metadata} contentType={contentType} cost={cost} uri={uri} outpoint={outpoint} costIncludesData={costIncludesData}  />
          </div> : '' }
        <div className="card__content">
          <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
        </div>
      </section>
    </main>
  )
}

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

export default FilePage;

//
// const ShowPage = (props) => {
//   const {
//     claim,
//     navigate,
//     claim: {
//       txid,
//       nout,
//       has_signature: hasSignature,
//       signature_is_valid: signatureIsValid,
//       value,
//       value: {
//         stream,
//         stream: {
//           metadata,
//           source,
//           metadata: {
//             title,
//           } = {},
//           source: {
//             contentType,
//           } = {},
//         } = {},
//       } = {},
//     },
//     uri,
//     isDownloaded,
//     fileInfo,
//     costInfo,
//     costInfo: {
//       cost,
//       includesData: costIncludesData,
//     } = {},
//   } = props
//
//   const outpoint = txid + ':' + nout;
//   const uriLookupComplete = !!claim && Object.keys(claim).length
//
//   if (props.isFailed) {
//     return (
//       <main className="main--single-column">
//         <section className="card">
//           <div className="card__inner">
//             <div className="card__title-identity"><h1>{uri}</h1></div>
//           </div>
//           <div className="card__content">
//             <p>
//               This location is not yet in use.
//               { ' ' }
//               <Link href="#" onClick={() => navigate('publish')} label="Put something here" />.
//             </p>
//           </div>
//         </section>
//       </main>
//     )
//   }
//
//   return (
//     <main className="main--single-column">
//       <section className="show-page-media">
//         { contentType && contentType.startsWith('video/') ?
//           <Video className="video-embedded" uri={uri} metadata={metadata} outpoint={outpoint} /> :
//           (metadata ? <Thumbnail src={metadata.thumbnail} /> : <Thumbnail />) }
//       </section>
//       <section className="card">
//         <div className="card__inner">
//           <div className="card__title-identity">
//             {isDownloaded === false
//               ? <span style={{float: "right"}}><FilePrice uri={lbryuri.normalize(uri)} /></span>
//               : null}
//             <h1>{title}</h1>
//             { uriLookupComplete ?
//               <div>
//                 <div className="card__subtitle">
//                   <UriIndicator uri={uri} />
//                 </div>
//                 <div className="card__actions">
//                   <FileActions uri={uri} outpoint={outpoint} metadata={metadata} contentType={contentType} />
//                 </div>
//               </div> : '' }
//           </div>
//           { uriLookupComplete ?
//             <div>
//               <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
//                 {metadata.description}
//               </div>
//             </div>
//             : <div className="card__content"><BusyMessage message="Loading magic decentralized data..." /></div> }
//         </div>
//         { metadata ?
//           <div className="card__content">
//             <FormatItem metadata={metadata} contentType={contentType} cost={cost} uri={uri} outpoint={outpoint} costIncludesData={costIncludesData}  />
//           </div> : '' }
//         <div className="card__content">
//           <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
//         </div>
//       </section>
//     </main>
//   )
// }