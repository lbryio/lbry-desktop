import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels, selectPendingClaims, doClearPublish } from 'lbry-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import LivestreamSetupPage from './view';
import { push } from 'connected-react-router';

const select = (state) => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  pendingClaims: selectPendingClaims(state),
});
const perform = (dispatch) => ({
  doNewLivestream: (path) => {
    dispatch(doClearPublish());
    dispatch(push(path));
  },
});
export default connect(select, perform)(LivestreamSetupPage);
