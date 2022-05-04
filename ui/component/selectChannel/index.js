import { connect } from 'react-redux';
import SelectChannel from './view';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';

const select = (state) => ({
  myChannelClaims: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaimId: selectActiveChannelClaim(state)?.claim_id,
});

const perform = (dispatch) => ({
  setActiveChannel: (claimId, override) => dispatch(doSetActiveChannel(claimId, override)),
});

export default connect(select, perform)(SelectChannel);
