// @flow
import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import {
  makeSelectClaimRewardError,
  doClaimRewardType,
  makeSelectIsRewardClaimPending,
  rewards as REWARD_TYPES,
} from 'lbryinc';
import ModalRewardCode from './view';

const select = (state): {} => ({
  rewardIsPending: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARD_TYPES.TYPE_REWARD_CODE,
  }),
  error: makeSelectClaimRewardError()(state, { reward_type: REWARD_TYPES.TYPE_REWARD_CODE }),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  submitRewardCode: (code: string) =>
    dispatch(doClaimRewardType(REWARD_TYPES.TYPE_REWARD_CODE, null, { code })),
});

export default connect(
  select,
  perform
)(ModalRewardCode);
