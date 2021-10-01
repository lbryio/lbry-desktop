import REWARDS from 'rewards';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doClaimRewardType } from 'redux/actions/rewards';
import { makeSelectClaimRewardError, makeSelectIsRewardClaimPending } from 'redux/selectors/rewards';

import ModalRewardCode from './view';

const select = state => ({
  rewardIsPending: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARDS.TYPE_REWARD_CODE,
  }),
  error: makeSelectClaimRewardError()(state, { reward_type: REWARDS.TYPE_REWARD_CODE }),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  submitRewardCode: code => dispatch(doClaimRewardType(REWARDS.TYPE_REWARD_CODE, { params: { code } })),
});

export default connect(select, perform)(ModalRewardCode);
