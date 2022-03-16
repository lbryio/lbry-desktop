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
import { getThumbnailCdnUrl } from 'util/thumbnail';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

const LIVESTREAM_STATUS_CHECK_INTERVAL = 30 * 1000;

type Props = {
  uri: string,
  claim: ?any,
  costInfo: any,
  streamingUrl: string,
  isResolvingUri: boolean,
  blackListedOutpoints: Array<{ txid: string, nout: number }>,
  isCurrentClaimLive: boolean,
  isLivestreamClaim: boolean,
  claimThumbnail?: string,
  obscurePreview: boolean,
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
    claimThumbnail,
    obscurePreview,
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
    push,
  } = useHistory();

  const { claim_id: claimId, canonical_url: canonicalUrl, signing_channel: channelClaim } = claim || {};

  const containerRef = React.useRef<any>();
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);
  const [livestreamsFetched, setLivestreamsFetched] = React.useState(false);

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
  const isLiveClaimStopped = liveClaim && !readyToDisplay;

  React.useEffect(() => {
    if (!claimThumbnail) return;

    setTimeout(() => {
      let newThumbnail = claimThumbnail;

      if (
        containerRef.current &&
        containerRef.current.parentElement &&
        containerRef.current.parentElement.offsetWidth
      ) {
        const w = containerRef.current.parentElement.offsetWidth;
        newThumbnail = getThumbnailCdnUrl({ thumbnail: newThumbnail, width: w, height: w });
      }

      if (newThumbnail !== thumbnail) {
        setThumbnail(newThumbnail);
      }
    }, 200);
  }, [claimThumbnail, thumbnail]);

  React.useEffect(() => {
    if (doFetchActiveLivestreams) {
      doFetchActiveLivestreams();
      setLivestreamsFetched(true);
    }
  }, [doFetchActiveLivestreams]);

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
    if (!channelClaim || !livestreamsFetched) return;

    const { claim_id: channelClaimId } = channelClaim || {};

    doFetchChannelLiveStatus(channelClaimId);

    const intervalId = setInterval(() => doFetchChannelLiveStatus(channelClaimId), LIVESTREAM_STATUS_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [livestreamsFetched, channelClaim, doFetchChannelLiveStatus]);

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
    <div
      className={
        isLiveClaimStopped
          ? 'embed__inline-button'
          : classnames('embed__wrapper', { 'embed__wrapper--light-background': embedLightBackground })
      }
      style={
        isLiveClaimStopped
          ? thumbnail && !obscurePreview
            ? { backgroundImage: `url("${thumbnail}")`, height: '100%' }
            : {}
          : undefined
      }
    >
      {!isLiveClaimStopped ? (
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
      ) : (
        <>
          <FileViewerEmbeddedTitle uri={uri} />

          <Button
            onClick={() => {
              const formattedUrl = formatLbryUrlForWeb(uri);
              push(formattedUrl);
            }}
            iconSize={30}
            title={__('View')}
            className="button--icon button--view"
          />
        </>
      )}
    </div>
  );
};

export default EmbedWrapperPage;
