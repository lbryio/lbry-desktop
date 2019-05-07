import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import {
  makeSelectClaimRewardError,
  doClaimRewardType,
  makeSelectIsRewardClaimPending,
  rewards as REWARD_TYPES,
} from 'lbryinc';
import ModalRewardCode from './view';

const select = state => ({
  rewardIsPending: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARD_TYPES.TYPE_REWARD_CODE,
  }),
  error: makeSelectClaimRewardError()(state, { reward_type: REWARD_TYPES.TYPE_REWARD_CODE }),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  submitRewardCode: code => dispatch(doClaimRewardType(REWARD_TYPES.TYPE_REWARD_CODE, { params: { code } })),
});

export default connect(
  select,
  perform
)(ModalRewardCode);
