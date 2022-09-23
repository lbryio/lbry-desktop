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
import { selectCommentsDisabledSettingForChannelId } from 'redux/selectors/comments';
import LivestreamPage from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, canonical_url } = claim || {};
  const channelClaimId = getChannelIdFromClaim(claim);

  return {
    uri: canonical_url || '',
    channelClaimId,
    chatDisabled: selectCommentsDisabledSettingForChannelId(state, channelClaimId),
    activeLivestreamForChannel: selectActiveLivestreamForChannel(state, channelClaimId),
    activeLivestreamInitialized: selectActiveLivestreamInitialized(state),
    socketConnection: selectSocketConnectionForId(state, claimId),
    isStreamPlaying: selectIsUriCurrentlyPlaying(state, uri),
    theaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
  };
};

const perform = {
  doSetPrimaryUri,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doFetchChannelLiveStatus,
};

export default connect(select, perform)(LivestreamPage);
