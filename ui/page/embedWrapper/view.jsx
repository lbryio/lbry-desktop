// @flow
import React, { useEffect } from 'react';
import classnames from 'classnames';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import Spinner from 'component/spinner';
import Button from 'component/button';
import Card from 'component/common/card';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';

const FileRender = React.lazy(() => import('component/fileRender' /* webpackChunkName: "fileRender" */));

type Props = {
  uri: string,
  resolveUri: (string) => void,
  claim: Claim,
  doPlayUri: (string) => void,
  costInfo: any,
  streamingUrl: string,
  doFetchCostInfoForUri: (string) => void,
  isResolvingUri: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

export const EmbedContext = React.createContext<any>();
const EmbedWrapperPage = (props: Props) => {
  const {
    resolveUri,
    claim,
    uri,
    doPlayUri,
    costInfo,
    streamingUrl,
    doFetchCostInfoForUri,
    isResolvingUri,
    blackListedOutpoints,
  } = props;

  const {
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const embedLightBackground = urlParams.get('embedBackgroundLight');
  const haveClaim = Boolean(claim);
  const readyToDisplay = claim && streamingUrl;
  const loading = !claim && isResolvingUri;
  const noContentFound = !claim && !isResolvingUri;
  const isPaidContent = costInfo && costInfo.cost > 0;
  const contentLink = formatLbryUrlForWeb(uri);
  const signingChannel = claim && claim.signing_channel;
  const isClaimBlackListed =
    claim &&
    blackListedOutpoints &&
    blackListedOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );

  useEffect(() => {
    if (resolveUri && uri && !haveClaim) {
      resolveUri(uri);
    }
    if (uri && haveClaim && costInfo && costInfo.cost === 0) {
      doPlayUri(uri);
    }
  }, [resolveUri, uri, doPlayUri, haveClaim, costInfo]);

  useEffect(() => {
    if (haveClaim && uri && doFetchCostInfoForUri) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, haveClaim, doFetchCostInfoForUri]);

  if (isClaimBlackListed) {
    return (
      <Card
        title={uri}
        subtitle={__(
          'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
        )}
        actions={
          <div className="section__actions">
            <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
          </div>
        }
      />
    );
  }

  return (
    <div
      className={classnames('embed__wrapper', {
        'embed__wrapper--light-background': embedLightBackground,
      })}
    >
      <EmbedContext.Provider value>
        {readyToDisplay ? (
          <React.Suspense fallback={null}>
            <FileRender uri={uri} embedded />
          </React.Suspense>
        ) : (
          <div className="embed__loading">
            <FileViewerEmbeddedTitle uri={uri} />

            <div className="embed__loading-text">
              {loading && <Spinner delayed light />}
              {noContentFound && <h1>{__('No content found.')}</h1>}
              {isPaidContent && (
                <div>
                  <h1>{__('Paid content cannot be embedded.')}</h1>
                  <div className="section__actions--centered">
                    <Button label={__('Watch on lbry.tv')} button="primary" href={contentLink} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </EmbedContext.Provider>
    </div>
  );
};

export default EmbedWrapperPage;
