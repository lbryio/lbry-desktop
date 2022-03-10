// @flow
import { formatLbryChannelName } from 'util/url';
import { lazyImport } from 'util/lazyImport';
import { LIVESTREAM_STARTS_SOON_BUFFER, LIVESTREAM_STARTED_RECENTLY_BUFFER } from 'constants/livestream';
import analytics from 'analytics';
import LivestreamLayout from 'component/livestreamLayout';
import moment from 'moment';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import { GEOBLOCKED_CHANNELS } from 'config';
import * as SETTINGS from 'constants/settings';
import React from 'react';
import { useIsMobile } from 'effects/use-screensize';

const LivestreamChatLayout = lazyImport(() => import('component/livestreamChatLayout' /* webpackChunkName: "chat" */));

function isLivestreamGeoAllowed(channelId: ?string, isLive: boolean) {
  const locale: LocaleInfo = window[SETTINGS.LOCALE];
  const geoBlock: GeoBlock = GEOBLOCKED_CHANNELS[channelId];

  if (locale && geoBlock) {
    const typeBlocked = geoBlock.types && geoBlock.types.includes('livestream');
    const countryBlocked = geoBlock.countries && geoBlock.countries.includes(locale.country);
    const europeanUnionOnly = geoBlock.continents && geoBlock.continents.includes('EU-UNION') && locale.is_eu_member;
    const continentBlocked =
      europeanUnionOnly || (geoBlock.continents && geoBlock.continents.includes(locale.continent));

    return typeBlocked && !countryBlocked && !continentBlocked;
  }

  // If 'locale/get' fails, we don't know whether to block or not. Flaw?
  return true;
}

type Props = {
  activeLivestreamForChannel: any,
  activeLivestreamInitialized: boolean,
  channelClaimId: ?string,
  chatDisabled: boolean,
  claim: StreamClaim,
  isAuthenticated: boolean,
  uri: string,
  doSetPlayingUri: ({ uri: ?string }) => void,
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void,
  doFetchChannelLiveStatus: (string) => void,
  doUserSetReferrer: (string) => void,
};

export default function LivestreamPage(props: Props) {
  const {
    activeLivestreamForChannel,
    activeLivestreamInitialized,
    channelClaimId,
    chatDisabled,
    claim,
    isAuthenticated,
    uri,
    doSetPlayingUri,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doFetchChannelLiveStatus,
    doUserSetReferrer,
  } = props;

  const isMobile = useIsMobile();

  const [activeStreamUri, setActiveStreamUri] = React.useState(false);
  const [showLivestream, setShowLivestream] = React.useState(false);
  const [showScheduledInfo, setShowScheduledInfo] = React.useState(false);
  const [hideComments, setHideComments] = React.useState(false);

  const isInitialized = Boolean(activeLivestreamForChannel) || activeLivestreamInitialized;
  const isChannelBroadcasting = Boolean(activeLivestreamForChannel);
  const claimId = claim && claim.claim_id;
  const isCurrentClaimLive = isChannelBroadcasting && activeLivestreamForChannel.claimId === claimId;
  const livestreamChannelId = channelClaimId || '';
  const isGeoBlocked = !isLivestreamGeoAllowed(channelClaimId, isCurrentClaimLive);

  // $FlowFixMe
  const release = moment.unix(claim.value.release_time);
  const stringifiedClaim = JSON.stringify(claim);

  React.useEffect(() => {
    // TODO: This should not be needed one we unify the livestream player (?)
    analytics.playerLoadedEvent('livestream', false);
  }, []);

  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!claim) return;

    const { claim_id: claimId, signing_channel: channelClaim } = claim;
    const channelName = channelClaim && formatLbryChannelName(channelClaim.canonical_url);

    if (claimId && channelName) {
      doCommentSocketConnect(uri, channelName, claimId);
    }

    return () => {
      if (claimId && channelName) {
        doCommentSocketDisconnect(claimId, channelName);
      }
    };
  }, [claim, uri, doCommentSocketConnect, doCommentSocketDisconnect]);

  // Find out current channels status + active live claim.
  React.useEffect(() => {
    doFetchChannelLiveStatus(livestreamChannelId);
    const intervalId = setInterval(() => doFetchChannelLiveStatus(livestreamChannelId), 30000);
    return () => clearInterval(intervalId);
  }, [livestreamChannelId, doFetchChannelLiveStatus]);

  React.useEffect(() => {
    setActiveStreamUri(!isCurrentClaimLive && isChannelBroadcasting ? activeLivestreamForChannel.claimUri : false);
  }, [isCurrentClaimLive, isChannelBroadcasting]); // eslint-disable-line react-hooks/exhaustive-deps

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

  React.useEffect(() => {
    if (uri && stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);
      if (!isAuthenticated) {
        const uri = jsonClaim.signing_channel && jsonClaim.signing_channel.permanent_url;
        if (uri) doUserSetReferrer(uri.replace('lbry://', ''));
      }
    }
  }, [uri, stringifiedClaim, isAuthenticated, doUserSetReferrer]);

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    // This can be removed when we start using the app video player, not a LIVESTREAM iframe
    doSetPlayingUri({ uri: null });

    return () => {
      if (isMobile) doSetPlayingUri({ uri: null });
    };
  }, [doSetPlayingUri, isMobile]);

  return (
    <Page
      className="file-page scheduledLivestream-wrapper"
      noFooter
      livestream
      chatDisabled={hideComments}
      rightSide={
        !isGeoBlocked &&
        !hideComments &&
        isInitialized && (
          <React.Suspense fallback={null}>
            <LivestreamChatLayout uri={uri} />
          </React.Suspense>
        )
      }
    >
      {isGeoBlocked && (
        <div className="main--empty">
          <Yrbl
            title={__('This creator has requested that their livestream be blocked in your region.')}
            type="sad"
            alwaysShow
          />
        </div>
      )}

      {isInitialized && !isGeoBlocked && (
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
