// @flow
import { SITE_NAME } from 'config';
import * as PAGES from 'constants/pages';
import React from 'react';
import classnames from 'classnames';
import FileRender from 'component/fileRender';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import Spinner from 'component/spinner';
import Button from 'component/button';
import Card from 'component/common/card';
import { formatLbryUrlForWeb, formatLbryChannelName } from 'util/url';
import { useHistory } from 'react-router';
import Yrbl from 'component/yrbl';
// $FlowFixMe cannot resolve ...
import useFetchLiveStatus from 'effects/use-fetch-live';
import useGetPoster from 'effects/use-get-poster';

type Props = {
  uri: string,
  claimId: ?string,
  haveClaim: boolean,
  nullClaim: boolean,
  canonicalUrl: ?string,
  txid: ?string,
  nout: ?string,
  channelUri: ?string,
  channelClaimId: ?string,
  channelTxid: ?string,
  channelNout: ?string,
  costInfo: any,
  streamingUrl: string,
  isResolvingUri: boolean,
  blackListedOutpoints: Array<{ txid: string, nout: number }>,
  isCurrentClaimLive: boolean,
  isLivestreamClaim: boolean,
  claimThumbnail?: string,
  obscurePreview: boolean,
  activeLivestreamInitialized: boolean,
  geoRestriction: ?GeoRestriction,
  latestClaimUrl: ?string,
  isNewestPath: ?boolean,
  fetchLatestClaimForChannel: (uri: string, isEmbed: boolean) => void,
  doResolveUri: (uri: string) => void,
  doPlayUri: (uri: string) => void,
  doFetchCostInfoForUri: (uri: string) => void,
  doFetchChannelLiveStatus: (string) => void,
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void,
  doFetchActiveLivestreams: () => void,
  setReferrer: (uri: string) => void,
};

export const EmbedContext = React.createContext<any>();

export default function EmbedWrapperPage(props: Props) {
  const {
    uri,
    claimId,
    haveClaim,
    nullClaim,
    canonicalUrl,
    txid,
    nout,
    channelUri,
    channelClaimId,
    channelTxid,
    channelNout,
    costInfo,
    streamingUrl,
    isResolvingUri,
    blackListedOutpoints,
    isCurrentClaimLive,
    isLivestreamClaim,
    claimThumbnail,
    obscurePreview,
    activeLivestreamInitialized,
    geoRestriction,
    latestClaimUrl,
    isNewestPath,
    fetchLatestClaimForChannel,
    doResolveUri,
    doPlayUri,
    doFetchCostInfoForUri,
    doFetchChannelLiveStatus,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doFetchActiveLivestreams,
    setReferrer,
  } = props;

  const {
    location: { search },
  } = useHistory();

  const [livestreamsFetched, setLivestreamsFetched] = React.useState(false);

  const channelUrl = channelUri && formatLbryChannelName(channelUri);
  const urlParams = new URLSearchParams(search);
  const featureParam = urlParams.get('feature');
  const latestContentPath = featureParam === PAGES.LATEST;
  const liveContentPath = featureParam === PAGES.LIVE_NOW;
  const rawReferrerParam = urlParams.get('r');
  const sanitizedReferrerParam = rawReferrerParam && rawReferrerParam.replace(':', '#');
  const embedLightBackground = urlParams.get('embedBackgroundLight');
  const readyToDisplay = isCurrentClaimLive || (haveClaim && streamingUrl);
  const isLiveClaimFetching = isLivestreamClaim && !activeLivestreamInitialized;
  const isLiveClaimNotPlaying = isLivestreamClaim && !isLiveClaimFetching && !readyToDisplay;
  const loading = (!haveClaim && isResolvingUri) || isLiveClaimFetching;
  const noContentFound = nullClaim && !isResolvingUri;
  const hasCost = costInfo && costInfo.cost > 0;
  const contentLink = formatLbryUrlForWeb(uri);
  const isClaimBlackListed =
    haveClaim &&
    blackListedOutpoints &&
    blackListedOutpoints.some(
      (outpoint) =>
        (channelUrl && outpoint.txid === channelTxid && outpoint.nout === channelNout) ||
        (outpoint.txid === txid && outpoint.nout === nout)
    );

  const thumbnail = useGetPoster(claimThumbnail);

  React.useEffect(() => {
    if (!latestClaimUrl && liveContentPath && claimId) {
      doFetchChannelLiveStatus(claimId);
    }
  }, [claimId, doFetchChannelLiveStatus, latestClaimUrl, liveContentPath]);

  React.useEffect(() => {
    if (!latestClaimUrl && latestContentPath && canonicalUrl) {
      fetchLatestClaimForChannel(canonicalUrl, true);
    }
  }, [canonicalUrl, fetchLatestClaimForChannel, latestClaimUrl, latestContentPath]);

  React.useEffect(() => {
    if (!sanitizedReferrerParam) setReferrer(uri);
  }, [sanitizedReferrerParam, setReferrer, uri]);

  React.useEffect(() => {
    if (doFetchActiveLivestreams && isLivestreamClaim) {
      doFetchActiveLivestreams();
      setLivestreamsFetched(true);
    }
  }, [doFetchActiveLivestreams, isLivestreamClaim]);

  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!isLivestreamClaim || !claimId || !channelUrl || !canonicalUrl) return;

    const channelName = formatLbryChannelName(channelUrl);

    doCommentSocketConnect(canonicalUrl, channelName, claimId);

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId, channelName);
      }
    };
  }, [canonicalUrl, channelUrl, claimId, doCommentSocketConnect, doCommentSocketDisconnect, isLivestreamClaim]);

  React.useEffect(() => {
    if (doResolveUri && uri && !haveClaim) {
      doResolveUri(uri);
    }

    if (uri && (isNewestPath ? latestClaimUrl : haveClaim) && costInfo && costInfo.cost === 0) {
      doPlayUri(uri);
    }
  }, [doPlayUri, doResolveUri, haveClaim, costInfo, uri, isNewestPath, latestClaimUrl]);

  React.useEffect(() => {
    if (haveClaim && uri && doFetchCostInfoForUri) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, haveClaim, doFetchCostInfoForUri]);

  useFetchLiveStatus(livestreamsFetched ? channelClaimId : undefined, doFetchChannelLiveStatus);

  // Wait for latest claim fetch
  if (isNewestPath && latestClaimUrl === undefined) {
    return (
      <div className="main--empty">
        <Spinner delayed />
      </div>
    );
  }

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

  if (geoRestriction) {
    return (
      <div className="main--empty">
        <Yrbl title={__('Content unavailable')} subtitle={__(geoRestriction.message || '')} type="sad" alwaysShow />
      </div>
    );
  }

  if (isLiveClaimNotPlaying) {
    return (
      <div
        className="embed__inline-button"
        style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")`, height: '100%' } : {}}
      >
        <FileViewerEmbeddedTitle uri={uri} />

        <a target="_blank" rel="noopener noreferrer" href={formatLbryUrlForWeb(uri)}>
          <Button iconSize={30} title={__('View')} className="button--icon button--view" />
        </a>
      </div>
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
              {(loading || (!haveClaim && !noContentFound)) && <Spinner delayed light />}

              {noContentFound && <h1>{__('No content found.')}</h1>}

              {hasCost && (
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
}
