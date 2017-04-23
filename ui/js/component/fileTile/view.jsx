import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileCardStream from 'component/fileCardStream'
import {FileActions} from 'component/file-actions.js';
import {Thumbnail, TruncatedText, FilePrice} from 'component/common.js';
import UriIndicator from 'component/channel-indicator.js';

class FileTile extends React.Component {
  render() {
    const {
      resolvedUris,
      displayStyle,
      uri,
    } = this.props
    const resolvedUri = resolvedUris[uri] || {}
    const claimInfo = resolvedUri.claim

    if(!claimInfo) {
      if (displayStyle == 'card') {
        return <FileCardStream
          outpoint={null}
          metadata={{title: this.props.uri, description: "Loading..."}}
          contentType={null}
          hidePrice={true}
          hasSignature={false}
          signatureIsValid={false}
          uri={this.props.uri}
        />
      }
      return null
    }

    const {
      txid,
      nout,
      has_signature,
      signature_is_valid,
      value: {
        stream: {
          metadata,
          source: {
            contentType
          }
        }
      }
    } = claimInfo

    return displayStyle == 'card' ?
      <FileCardStream
        outpoint={txid + ':' + nout}
        metadata={metadata}
        contentType={contentType}
        hasSignature={has_signature}
        signatureIsValid={signature_is_valid}
        {... this.props}
      /> :
      <FileTileStream
        outpoint={txid + ':' + nout}
        metadata={metadata}
        contentType={contentType}
        hasSignature={has_signature}
        signatureIsValid={signature_is_valid}
        {... this.props}
      />
  }
}
// class FileTile extends React.Component {
//   render() {
//     const {
//       resolvedUris,
//       displayStyle,
//       key,
//     } = this.props

//     const resolvedUri = resolvedUris[key]
//     const claimInfo = resolvedUri.claim

//     const {
//       txid,
//       nout,
//       has_signature,
//       signature_is_valid,
//       value: {
//         stream: {
//           metadata,
//           source: {
//             contentType
//           }
//         }
//       }
//     } = claimInfo

//     if (claimInfo) {
//       if (displayStyle == 'card') {
//         return <div></div>
//       }
//       return null;
//     }

//     return displayStyle == 'card' ?
//       <FileCardStream
//         outpoint={txid + ':' + nout}
//         metadata={metadata}
//         contentType={contentType}
//         hasSignature={has_signature}
//         signatureIsValid={signature_is_valid}
//         {... this.props}
//       /> :
//       <FileTileStream
//         outpoint={txid + ':' + nout}
//         metadata={metadata}
//         contentType={contentType}
//         hasSignature={has_signature}
//         signatureIsValid={signature_is_valid}
//         {... this.props}
//       />
//   }
// }

// let FileTile = React.createClass({
//   _isMounted: false,

//   propTypes: {
//     uri: React.PropTypes.string.isRequired,
//   },

//   getInitialState: function() {
//     return {
//       outpoint: null,
//       claimInfo: null
//     }
//   },

//   componentDidMount: function() {
//     this._isMounted = true;

//     lbry.resolve({uri: this.props.uri}).then((resolutionInfo) => {
//       if (this._isMounted && resolutionInfo && resolutionInfo.claim && resolutionInfo.claim.value &&
//                     resolutionInfo.claim.value.stream && resolutionInfo.claim.value.stream.metadata) {
//         // In case of a failed lookup, metadata will be null, in which case the component will never display
//         this.setState({
//           claimInfo: resolutionInfo.claim,
//         });
//       }
//     });
//   },
//   componentWillUnmount: function() {
//     this._isMounted = false;
//   },
//   render: function() {
//     if (!this.state.claimInfo) {
//       if (this.props.displayStyle == 'card') {
//         return <FileCardStream outpoint={null} metadata={{title: this.props.uri, description: "Loading..."}} contentType={null} hidePrice={true}
//                                hasSignature={false} signatureIsValid={false} uri={this.props.uri} />
//       }
//       return null;
//     }

//     const {txid, nout, has_signature, signature_is_valid,
//            value: {stream: {metadata, source: {contentType}}}} = this.state.claimInfo;

//     return this.props.displayStyle == 'card' ?
//            <FileCardStream outpoint={txid + ':' + nout} metadata={metadata} contentType={contentType}
//               hasSignature={has_signature} signatureIsValid={signature_is_valid} {... this.props}/> :
//           <FileTileStream outpoint={txid + ':' + nout} metadata={metadata} contentType={contentType}
//           hasSignature={has_signature} signatureIsValid={signature_is_valid} {... this.props} />;
//   }
// });

export default FileTile
