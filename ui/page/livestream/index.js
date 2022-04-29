import { connect } from 'react-redux';
import { makeSelectTagInClaimOrChannelForUri, selectClaimForUri } from 'redux/selectors/claims';
import { doSetPrimaryUri } from 'redux/actions/content';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { getChannelIdFromClaim } from 'util/claim';
import {
  selectActiveLivestreamForChannel,
  selectActiveLivestreamInitialized,
  selectSocketConnectionForId,
} from 'redux/selectors/livestream';
import { selectIsUriCurrentlyPlaying } from 'redux/selectors/content';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import LivestreamPage from './view';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId, canonical_url } = claim || {};
  const channelClaimId = getChannelIdFromClaim(claim);

  return {
    uri: canonical_url || '',
    isAuthenticated: selectUserVerifiedEmail(state),
    channelClaimId,
    chatDisabled: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_COMMENTS_TAG)(state),
    activeLivestreamForChannel: selectActiveLivestreamForChannel(state, channelClaimId),
    activeLivestreamInitialized: selectActiveLivestreamInitialized(state),
    socketConnection: selectSocketConnectionForId(state, claimId),
    isStreamPlaying: selectIsUriCurrentlyPlaying(state, uri),
  };
};

const perform = {
  doSetPrimaryUri,
  doUserSetReferrer,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doFetchChannelLiveStatus,
};

export default connect(select, perform)(LivestreamPage);
