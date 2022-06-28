import { connect } from 'react-redux';
import SelectChannel from './view';
import { selectBalance } from 'redux/selectors/wallet';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'redux/selectors/claims';
import { doFetchChannelListMine, doCreateChannel } from 'redux/actions/claims';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';

const select = (state) => ({
  myChannelClaims: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  balance: selectBalance(state),
  emailVerified: selectUserVerifiedEmail(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = (dispatch) => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  setActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(SelectChannel);
