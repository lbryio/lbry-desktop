import { connect } from 'react-redux';
import SelectChannel from './view';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectActiveChannelId } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';

const select = (state) => ({
  myChannelClaims: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelId: selectActiveChannelId(state),
});

const perform = (dispatch) => ({
  setActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(SelectChannel);
