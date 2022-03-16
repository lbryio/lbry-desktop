// @flow
import { SITE_NAME } from 'config';
import React from 'react';
import classnames from 'classnames';
import FileRender from 'component/fileRender';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import Spinner from 'component/spinner';
import Button from 'component/button';
import Card from 'component/common/card';
import { formatLbryUrlForWeb, formatLbryChannelName } from 'util/url';
import { useHistory } from 'react-router';

const LIVESTREAM_STATUS_CHECK_INTERVAL = 30000;

type Props = {
  uri: string,
  claim: ?any,
  costInfo: any,
  streamingUrl: string,
  isResolvingUri: boolean,
  blackListedOutpoints: Array<{ txid: string, nout: number }>,
  isCurrentClaimLive: boolean,
  isLivestreamClaim: boolean,
  activeLivestreams: ?any,
  doResolveUri: (uri: string) => void,
  doPlayUri: (uri: string) => void,
  doFetchCostInfoForUri: (uri: string) => void,
  doFetchChannelLiveStatus: (string) => void,
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void,
  doFetchActiveLivestreams: () => void,
};

export const EmbedContext = React.createContext<any>();

const EmbedWrapperPage = (props: Props) => {
  const {
    uri,
    claim,
    costInfo,
    streamingUrl,
    isResolvingUri,
    blackListedOutpoints,
    isCurrentClaimLive,
    isLivestreamClaim: liveClaim,
    activeLivestreams,
    doResolveUri,
    doPlayUri,
    doFetchCostInfoForUri,
    doFetchChannelLiveStatus,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doFetchActiveLivestreams,
  } = props;

  const {
    location: { search },
  } = useHistory();

  const { claim_id: claimId, canonical_url: canonicalUrl, signing_channel: channelClaim } = claim || {};

  const channelUrl = channelClaim && formatLbryChannelName(channelClaim.canonical_url);
  const urlParams = new URLSearchParams(search);
  const embedLightBackground = urlParams.get('embedBackgroundLight');
  const haveClaim = Boolean(claim);
  const readyToDisplay = isCurrentClaimLive || (claim && streamingUrl);
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

  React.useEffect(doFetchActiveLivestreams, [doFetchActiveLivestreams]);

  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!liveClaim || !claimId || !channelUrl || !canonicalUrl) return;

    const channelName = formatLbryChannelName(channelUrl);

    doCommentSocketConnect(canonicalUrl, channelName, claimId);

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId, channelName);
      }
    };
  }, [canonicalUrl, channelUrl, claimId, doCommentSocketConnect, doCommentSocketDisconnect, liveClaim]);

  React.useEffect(() => {
    if (doResolveUri && uri && !haveClaim) {
      doResolveUri(uri);
    }
    if (uri && haveClaim && costInfo && costInfo.cost === 0) {
      doPlayUri(uri);
    }
  }, [doResolveUri, uri, doPlayUri, haveClaim, costInfo]);

  React.useEffect(() => {
    if (haveClaim && uri && doFetchCostInfoForUri) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, haveClaim, doFetchCostInfoForUri]);

  // Find out current channels status + active live claim every 30 seconds
  React.useEffect(() => {
    if (!channelClaim || !activeLivestreams) return;

    const { claim_id: channelClaimId } = channelClaim || {};

    doFetchChannelLiveStatus(channelClaimId);

    const intervalId = setInterval(() => doFetchChannelLiveStatus(channelClaimId), LIVESTREAM_STATUS_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [activeLivestreams, channelClaim, doFetchChannelLiveStatus]);

  if (isClaimBlackListed) {
    return (
      <Card
        title={uri}
        subtitle={__(
          'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
        )}
        actions={
          <div className="section__actions">
            <Button button="link" href="https://odysee.com/@OdyseeHelp:b/copyright:f" label={__('Read More')} />
          </div>
        }
      />
    );
  }

  return (
    <div className={classnames('embed__wrapper', { 'embed__wrapper--light-background': embedLightBackground })}>
      <EmbedContext.Provider value>
        {readyToDisplay ? (
          <FileRender uri={uri} embedded />
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
                    <Button label={__('Watch on %SITE_NAME%', { SITE_NAME })} button="primary" href={contentLink} />
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
