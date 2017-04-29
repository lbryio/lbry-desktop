import React from 'react';
import lbry from 'lbry.js';
import lighthouse from 'lighthouse.js';
import lbryuri from 'lbryuri.js';
import Video from 'page/video'
import {
  TruncatedText,
  Thumbnail,
  BusyMessage,
} from 'component/common';
import FilePrice from 'component/filePrice'
import FileActions from 'component/fileActions';
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

const ShowPage = (props) => {
  const {
    claim,
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

  return (
    <main className="constrained-page">
      <section className="show-page-media">
        { contentType && contentType.startsWith('video/') ?
            <Video className="video-embedded" uri={uri} metadata={metadata} outpoint={outpoint} /> :
            (metadata ? <Thumbnail src={metadata.thumbnail} /> : <Thumbnail />) }
      </section>
      <section className="card">
        <div className="card__inner">
          <div className="card__title-identity">
            {isDownloaded === false
              ? <span style={{float: "right"}}><FilePrice uri={lbryuri.normalize(uri)} /></span>
              : null}
            <h1>{title}</h1>
            { uriLookupComplete ?
              <div>
                <div className="card__subtitle">
                  <UriIndicator uri={uri} hasSignature={hasSignature} signatureIsValid={signatureIsValid} />
                </div>
                <div className="card__actions">
                  <FileActions uri={uri} outpoint={outpoint} metadata={metadata} contentType={contentType} />
                </div>
              </div> : '' }
          </div>
          { uriLookupComplete ?
              <div>
                <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
                  {metadata.description}
                </div>
              </div>
            : <div className="card__content"><BusyMessage message="Loading magic decentralized data..." /></div> }
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

export default ShowPage;
