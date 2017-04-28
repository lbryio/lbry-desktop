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
      displayStyle,
      uri,
    } = this.props
    const claimInfo = this.props.claims(uri)

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

export default FileTile
