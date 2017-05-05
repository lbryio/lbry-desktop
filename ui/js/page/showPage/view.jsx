import React from 'react';
import {
  BusyMessage,
} from 'component/common';
import FilePage from 'page/filePage'

const ShowPage = (props) => {
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
    isFailed,
    claimType,
  } = props

  const outpoint = txid + ':' + nout;
  const uriLookupComplete = !!claim && Object.keys(claim).length
  const pageTitle = metadata ? metadata.title : uri;

    let innerContent = "";

    if (!uriLookupComplete || isFailed) {
      innerContent = <section className="card">
          <div className="card__inner">
            <div className="card__title-identity"><h1>{pageTitle}</h1></div>
          </div>
          <div className="card__content">
            { uriLookupComplete ?
              <p>This location is not yet in use. { ' ' }<Link href="#" onClick={() => navigate('publish')} label="Put something here" />.</p> :
                <BusyMessage message="Loading magic decentralized data..." />
            }
          </div>
      </section>;
    } else if (claimType == "channel") {
      innerContent = <ChannelPage title={uri} />
    } else {
      innerContent = <FilePage uri={uri} />
    }

    return (
      <main className="main--single-column">{innerContent}</main>
    )
}

export default ShowPage
