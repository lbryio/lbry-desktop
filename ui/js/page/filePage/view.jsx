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

class FilePage extends React.Component{

  componentWillMount() {
    this.fetchFileInfo(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFileInfo(nextProps)
  }

  fetchFileInfo(props) {
    if (!props.fileInfo) {
      console.log('fetch file info')
      props.fetchFileInfo()
    }
  }

  render() {
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
    } = this.props

    const outpoint = txid + ':' + nout;
    const uriLookupComplete = !!claim && Object.keys(claim).length

    const channelUriObj = lbryuri.parse(uri)
    delete channelUriObj.path;
    delete channelUriObj.contentName;
    const channelUri = signatureIsValid && hasSignature && channelUriObj.isChannel ? lbryuri.build(channelUriObj, false) : null;
    const uriIndicator = <UriIndicator uri={uri} />

    //            <p>This location is not yet in use. { ' ' }<Link onClick={() => navigate('/publish')} label="Put something here" />.</p>

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
                : null}<h1>{title}</h1>
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
              <FormatItem metadata={metadata} contentType={contentType} cost={cost} uri={uri} outpoint={outpoint}
                          costIncludesData={costIncludesData} />
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