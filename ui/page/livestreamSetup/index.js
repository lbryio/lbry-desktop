import { connect } from 'react-redux';
import { selectHasChannels, selectFetchingMyChannels } from 'redux/selectors/claims';
import { doClearPublish } from 'redux/actions/publish';
import { selectActiveChannelClaim, selectActiveChannelStakedLevel } from 'redux/selectors/app';
import { doFetchNoSourceClaims } from 'redux/actions/livestream';
import { selectUser, selectOdyseeMembershipName } from 'redux/selectors/user';
import {
  makeSelectPendingLivestreamsForChannelId,
  makeSelectLivestreamsForChannelId,
  makeSelectIsFetchingLivestreams,
} from 'redux/selectors/livestream';
import LivestreamSetupPage from './view';
import { push } from 'connected-react-router';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const { claim_id: channelId, name: channelName } = activeChannelClaim || {};
  return {
    channelName,
    channelId,
    hasChannels: selectHasChannels(state),
    fetchingChannels: selectFetchingMyChannels(state),
    activeChannelClaim,
    myLivestreamClaims: makeSelectLivestreamsForChannelId(channelId)(state),
    pendingClaims: makeSelectPendingLivestreamsForChannelId(channelId)(state),
    fetchingLivestreams: makeSelectIsFetchingLivestreams(channelId)(state),
    user: selectUser(state),
    odyseeMembership: selectOdyseeMembershipName(state),
    activeChannelStakedLevel: selectActiveChannelStakedLevel(state),
  };
};
const perform = (dispatch) => ({
  doNewLivestream: (path) => {
    dispatch(doClearPublish());
    dispatch(push(path));
  },
  fetchNoSourceClaims: (id) => dispatch(doFetchNoSourceClaims(id)),
});
export default connect(select, perform)(LivestreamSetupPage);
