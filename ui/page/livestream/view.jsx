// @flow
import { formatLbryChannelName } from 'util/url';
import { lazyImport } from 'util/lazyImport';
import { LIVESTREAM_STARTS_SOON_BUFFER, LIVESTREAM_STARTED_RECENTLY_BUFFER } from 'constants/livestream';
import analytics from 'analytics';
import LivestreamLayout from 'component/livestreamLayout';
import moment from 'moment';
import Page from 'component/page';
import React from 'react';
import { useIsMobile } from 'effects/use-screensize';
import useFetchLiveStatus from 'effects/use-fetch-live';
import Spinner from 'component/spinner';

const ChatLayout = lazyImport(() => import('component/chat' /* webpackChunkName: "chat" */));

type Props = {
  activeLivestreamForChannel: any,
  activeLivestreamInitialized: boolean,
  channelClaimId: ?string,
  chatDisabled: boolean,
  claim: StreamClaim,
  uri: string,
  socketConnection: { connected: ?boolean },
  isStreamPlaying: boolean,
  doSetPrimaryUri: (uri: ?string) => void,
  doCommentSocketConnect: (uri: string, channelName: string, claimId: string) => void,
  doCommentSocketDisconnect: (claimId: string, channelName: string) => void,
  doFetchChannelLiveStatus: (string) => void,
  theaterMode?: Boolean,
};

export const LivestreamContext = React.createContext<any>();

export default function LivestreamPage(props: Props) {
  const {
    activeLivestreamForChannel,
    activeLivestreamInitialized,
    channelClaimId,
    chatDisabled,
    claim,
    uri,
    socketConnection,
    isStreamPlaying,
    doSetPrimaryUri,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doFetchChannelLiveStatus,
    theaterMode,
  } = props;

  const isMobile = useIsMobile();

  const streamPlayingRef = React.useRef();

  const [activeStreamUri, setActiveStreamUri] = React.useState(false);
  const [showLivestream, setShowLivestream] = React.useState(false);
  const [showScheduledInfo, setShowScheduledInfo] = React.useState(false);
  const [hideComments, setHideComments] = React.useState(false);
  const [layountRendered, setLayountRendered] = React.useState(chatDisabled || isMobile);

  const isInitialized = Boolean(activeLivestreamForChannel) || activeLivestreamInitialized;
  const isChannelBroadcasting = Boolean(activeLivestreamForChannel);
  const claimId = claim && claim.claim_id;
  const isCurrentClaimLive = isChannelBroadcasting && activeLivestreamForChannel.claimId === claimId;
  const livestreamChannelId = channelClaimId || '';

  const releaseTime: moment = moment.unix(claim?.value?.release_time || 0);

  const [hyperchatsHidden, setHyperchatsHidden] = React.useState(false);

  React.useEffect(() => {
    // TODO: This should not be needed once we unify the livestream player (?)
    analytics.event.playerLoaded('livestream', false);
  }, []);

  const { signing_channel: channelClaim } = claim || {};
  const { canonical_url: channelUrl } = channelClaim || {};

  // On livestream page, only connect, fileRenderFloating will handle disconnect.
  // (either by leaving page with floating player off, or by closing the player)
  React.useEffect(() => {
    const { claim_id: claimId, signing_channel: channelClaim } = claim;
    const channelName = channelClaim && formatLbryChannelName(channelUrl);

    if (claimId && channelName && !socketConnection?.connected) {
      doCommentSocketConnect(uri, channelName, claimId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- willAutoplay mount only
  }, [channelUrl, claim, doCommentSocketConnect, doCommentSocketDisconnect, socketConnection, uri]);

  React.useEffect(() => {
    // use for unmount case without triggering render
    streamPlayingRef.current = isStreamPlaying;
  }, [isStreamPlaying]);

  React.useEffect(() => {
    return () => {
      if (!streamPlayingRef.current) {
        const { claim_id: claimId, signing_channel: channelClaim } = claim;
        const channelName = channelClaim && formatLbryChannelName(channelUrl);

        if (claimId && channelName) doCommentSocketDisconnect(claimId, channelName);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on unmount -> leave page
  }, []);

  useFetchLiveStatus(isStreamPlaying ? undefined : livestreamChannelId, doFetchChannelLiveStatus);

  React.useEffect(() => {
    setActiveStreamUri(!isCurrentClaimLive && isChannelBroadcasting ? activeLivestreamForChannel.claimUri : false);
  }, [isCurrentClaimLive, isChannelBroadcasting]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!isInitialized) return;

    const claimReleaseInFuture = () => releaseTime.isAfter();
    const claimReleaseInPast = () => releaseTime.isBefore();

    const claimReleaseStartingSoon = () =>
      releaseTime.isBetween(moment(), moment().add(LIVESTREAM_STARTS_SOON_BUFFER, 'minutes'));

    const claimReleaseStartedRecently = () =>
      releaseTime.isBetween(moment().subtract(LIVESTREAM_STARTED_RECENTLY_BUFFER, 'minutes'), moment());

    const checkShowLivestream = () =>
      isChannelBroadcasting &&
      isCurrentClaimLive &&
      (claimReleaseInPast() || claimReleaseStartingSoon() || claimReleaseInFuture());

    const checkShowScheduledInfo = () =>
      (!isChannelBroadcasting && (claimReleaseInFuture() || claimReleaseStartedRecently())) ||
      (isChannelBroadcasting &&
        ((!isCurrentClaimLive && (claimReleaseInFuture() || claimReleaseStartedRecently())) ||
          (isCurrentClaimLive && claimReleaseInFuture() && !claimReleaseStartingSoon())));

    const checkCommentsDisabled = () => chatDisabled || (claimReleaseInFuture() && !claimReleaseStartingSoon());

    const calculateStreamReleaseState = () => {
      setShowLivestream(checkShowLivestream());
      setShowScheduledInfo(checkShowScheduledInfo());
      setHideComments(checkCommentsDisabled());
    };

    calculateStreamReleaseState();
    const intervalId = setInterval(calculateStreamReleaseState, 5000);

    if (isCurrentClaimLive && claimReleaseInPast() && isChannelBroadcasting === true) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [chatDisabled, isChannelBroadcasting, releaseTime, isCurrentClaimLive, isInitialized]);

  React.useEffect(() => {
    doSetPrimaryUri(uri);
    return () => doSetPrimaryUri(null);
  }, [doSetPrimaryUri, uri, isStreamPlaying]);

  return (
    <Page
      className="file-page scheduledLivestream-wrapper"
      noFooter
      livestream
      chatDisabled={hideComments}
      rightSide={
        !theaterMode &&
        !hideComments &&
        isInitialized && (
          <React.Suspense fallback={null}>
            <ChatLayout
              uri={uri}
              hyperchatsHidden={hyperchatsHidden}
              toggleHyperchats={() => setHyperchatsHidden(!hyperchatsHidden)}
              setLayountRendered={setLayountRendered}
            />
          </React.Suspense>
        )
      }
    >
      {isInitialized ? (
        <LivestreamContext.Provider value={{ livestreamPage: true, layountRendered }}>
          <LivestreamLayout
            uri={uri}
            hideComments={hideComments}
            releaseTimeMs={releaseTime.unix() * 1000}
            isCurrentClaimLive={isCurrentClaimLive}
            showLivestream={showLivestream}
            showScheduledInfo={showScheduledInfo}
            activeStreamUri={activeStreamUri}
            theaterMode={theaterMode}
          />
        </LivestreamContext.Provider>
      ) : (
        <div className="main--empty">
          <Spinner />
        </div>
      )}
    </Page>
  );
}
