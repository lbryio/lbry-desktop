import REWARD_TYPES from 'rewards';
import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { doClaimRewardType } from 'redux/actions/rewards';
import { selectIsMyChannelCountOverLimit } from 'redux/selectors/claims';
import ChannelNew from './view';

const select = (state) => ({
  balance: selectBalance(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  channelCountOverLimit: selectIsMyChannelCountOverLimit(state),
});

export default connect(select, (dispatch) => ({
  claimConfirmEmailReward: () =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.TYPE_CONFIRM_EMAIL, {
        notifyError: false,
      })
    ),
}))(ChannelNew);
