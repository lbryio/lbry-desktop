import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { doSetPrimaryUri } from 'redux/actions/content';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { getChannelIdFromClaim } from 'util/claim';
import {
  selectActiveLivestreamForChannel,
  selectActiveLivestreamInitialized,
  selectSocketConnectionForId,
} from 'redux/selectors/livestream';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import { selectIsUriCurrentlyPlaying } from 'redux/selectors/content';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import { doMembershipContentforStreamClaimId } from 'redux/actions/memberships';
import { selectCommentsDisabledSettingForChannelId } from 'redux/selectors/comments';
import { selectNoRestrictionOrUserIsMemberForContentClaimId } from 'redux/selectors/memberships';

import LivestreamPage from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, canonical_url } = claim || {};
  const channelClaimId = getChannelIdFromClaim(claim);

  return {
    chatDisabled: selectCommentsDisabledSettingForChannelId(state, channelClaimId),
    activeLivestreamForChannel: selectActiveLivestreamForChannel(state, channelClaimId),
    activeLivestreamInitialized: selectActiveLivestreamInitialized(state),
    channelClaimId,
    isStreamPlaying: selectIsUriCurrentlyPlaying(state, uri),
    socketConnection: selectSocketConnectionForId(state, claimId),
    theaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    uri: canonical_url || '',
    contentUnlocked: claimId && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claimId),
  };
};

const perform = {
  doSetPrimaryUri,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doFetchChannelLiveStatus,
  doMembershipContentforStreamClaimId,
};

export default connect(select, perform)(LivestreamPage);
