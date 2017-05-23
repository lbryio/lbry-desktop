import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Video from 'component/video'
import Audio from 'component/audio'
import {
  Thumbnail,
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

class FilePage extends React.Component{

  componentDidMount() {
    this.fetchFileInfo(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFileInfo(nextProps)
  }

  fetchFileInfo(props) {
    if (props.fileInfo === undefined) {
      props.fetchFileInfo(props.uri)
    }
  }

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      contentType,
      uri,
    } = this.props

    if (!claim || !metadata) {
      return <span className="empty">Empty claim or metadata info.</span>
    }

    const {
      txid,
      nout,
      channel_name: channelName,
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
      value
    } = claim

    const outpoint = txid + ':' + nout
    const title = metadata.title
    const channelClaimId = claim.value && claim.value.publisherSignature ? claim.value.publisherSignature.certificateId : null;
    const channelUri = signatureIsValid && hasSignature && channelName ? lbryuri.build({channelName, claimId: channelClaimId}, false) : null
    const uriIndicator = <UriIndicator uri={uri} />
    const playableContent = contentType && (contentType.startsWith('video/') || contentType.startsWith('audio/'))

    return (
      <main className="main--single-column">
        <section className="show-page-media">
          {contentType && contentType.startsWith('video/') &&
            <Video className="video-embedded" uri={uri} />
          }

          {contentType && contentType.startsWith('audio/') &&
            <Audio className="audio-embedded" uri={uri} />
          }

          {!playableContent && metadata && metadata.thumbnail &&
            <Thumbnail src={metadata.thumbnail} />}

          {!playableContent && (!metadata || (metadata && !metadata.thumbnail)) &&
          <Thumbnail />}

        </section>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              {!fileInfo || fileInfo.written_bytes <= 0
                ? <span style={{float: "right"}}><FilePrice uri={lbryuri.normalize(uri)} /></span>
                : null}<h1>{title}</h1>
              <div className="card__subtitle">
                { channelUri ?
                  <Link onClick={() => this.props.navigate('/show', { uri: channelUri })}>{uriIndicator}</Link> :
                  uriIndicator}
              </div>
              <div className="card__actions">
                <FileActions uri={uri} />
              </div>
            </div>
            <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
              {metadata && metadata.description}
            </div>
          </div>
          { metadata ?
            <div className="card__content">
              <FormatItem metadata={metadata} contentType={contentType} />
            </div> : '' }
          <div className="card__content">
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </div>
        </section>
      </main>
    )
  }
}

export default FilePage;