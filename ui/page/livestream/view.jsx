// @flow
import React from 'react';
import { lazyImport } from 'util/lazyImport';
import Page from 'component/page';
import LivestreamLayout from 'component/livestreamLayout';
import analytics from 'analytics';
import moment from 'moment';
import { LIVESTREAM_STARTS_SOON_BUFFER, LIVESTREAM_STARTED_RECENTLY_BUFFER } from 'constants/livestream';

const LivestreamComments = lazyImport(() => import('component/livestreamComments' /* webpackChunkName: "comments" */));

type Props = {
  uri: string,
  claim: StreamClaim,
  doSetPlayingUri: ({ uri: ?string }) => void,
  isAuthenticated: boolean,
  doUserSetReferrer: (string) => void,
  channelClaimId: ?string,
  chatDisabled: boolean,
  doCommentSocketConnect: (string, string) => void,
  doCommentSocketDisconnect: (string) => void,
  doFetchActiveLivestream: (string) => void,
  currentChannelStatus: LivestreamChannelStatus,
};

export default function LivestreamPage(props: Props) {
  const {
    uri,
    claim,
    doSetPlayingUri,
    isAuthenticated,
    doUserSetReferrer,
    channelClaimId,
    chatDisabled,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doFetchActiveLivestream,
    currentChannelStatus,
  } = props;

  React.useEffect(() => {
    // TODO: This should not be needed one we unify the livestream player (?)
    analytics.playerLoadedEvent('livestream', false);
  }, []);

  const claimId = claim && claim.claim_id;

  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (claimId) {
      doCommentSocketConnect(uri, claimId);
    }

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId);
      }
    };
  }, [claimId, uri, doCommentSocketConnect, doCommentSocketDisconnect]);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isChannelBroadcasting, setIsChannelBroadcasting] = React.useState(false);
  const [isCurrentClaimLive, setIsCurrentClaimLive] = React.useState(false);

  const livestreamChannelId = channelClaimId || '';

  // Find out current channels status + active live claim.
  React.useEffect(() => {
    doFetchActiveLivestream(livestreamChannelId);
    const intervalId = setInterval(() => doFetchActiveLivestream(livestreamChannelId), 30000);
    return () => clearInterval(intervalId);
  }, [livestreamChannelId, doFetchActiveLivestream]);

  React.useEffect(() => {
    const initialized = currentChannelStatus.channelId === livestreamChannelId;
    setIsInitialized(initialized);
    if (initialized) {
      setIsChannelBroadcasting(currentChannelStatus.isBroadcasting);
      setIsCurrentClaimLive(currentChannelStatus.liveClaim.claimId === claimId);
    }
  }, [currentChannelStatus, livestreamChannelId, claimId]);

  const [activeStreamUri, setActiveStreamUri] = React.useState(false);

  React.useEffect(() => {
    setActiveStreamUri(!isCurrentClaimLive && isChannelBroadcasting ? currentChannelStatus.liveClaim.claimUri : false);
  }, [isCurrentClaimLive, isChannelBroadcasting]); // eslint-disable-line react-hooks/exhaustive-deps

  // $FlowFixMe
  const release = moment.unix(claim.value.release_time);

  const [showLivestream, setShowLivestream] = React.useState(false);
  const [showScheduledInfo, setShowScheduledInfo] = React.useState(false);
  const [hideComments, setHideComments] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized) return;

    const claimReleaseInFuture = () => release.isAfter();

    const claimReleaseInPast = () => release.isBefore();

    const claimReleaseStartingSoon = () =>
      release.isBetween(moment(), moment().add(LIVESTREAM_STARTS_SOON_BUFFER, 'minutes'));

    const claimReleaseStartedRecently = () =>
      release.isBetween(moment().subtract(LIVESTREAM_STARTED_RECENTLY_BUFFER, 'minutes'), moment());

    const checkShowLivestream = () =>
      isChannelBroadcasting && isCurrentClaimLive && (claimReleaseInPast() || claimReleaseStartingSoon());

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
    const intervalId = setInterval(calculateStreamReleaseState, 1000);

    if (isCurrentClaimLive && claimReleaseInPast() && isChannelBroadcasting === true) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [chatDisabled, isChannelBroadcasting, release, isCurrentClaimLive, isInitialized]);

  const stringifiedClaim = JSON.stringify(claim);

  React.useEffect(() => {
    if (uri && stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);
      if (!isAuthenticated) {
        const uri = jsonClaim.signing_channel && jsonClaim.signing_channel.permanent_url;
        if (uri) {
          doUserSetReferrer(uri.replace('lbry://', '')); //
        }
      }
    }
  }, [uri, stringifiedClaim, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    // This can be removed when we start using the app video player, not a LIVESTREAM iframe
    doSetPlayingUri({ uri: null });
  }, [doSetPlayingUri]);

  return (
    <Page
      className="file-page"
      noFooter
      livestream
      chatDisabled={hideComments}
      rightSide={
        !hideComments &&
        isInitialized && (
          <React.Suspense fallback={null}>
            <LivestreamComments uri={uri} />
          </React.Suspense>
        )
      }
    >
      {isInitialized && (
        <LivestreamLayout
          uri={uri}
          hideComments={hideComments}
          release={release}
          isCurrentClaimLive={isCurrentClaimLive}
          showLivestream={showLivestream}
          showScheduledInfo={showScheduledInfo}
          activeStreamUri={activeStreamUri}
        />
      )}
    </Page>
  );
}
