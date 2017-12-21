import React from 'react';
import { connect } from 'react-redux';
import { doCloseModal } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectUserIsRewardApproved } from 'redux/selectors/user';
import { selectBalance } from 'redux/selectors/wallet';
import {
  makeSelectHasClaimedReward,
  makeSelectRewardByType,
  selectUnclaimedRewardValue,
} from 'redux/selectors/rewards';
import * as settings from 'constants/settings';
import ModalCreditIntro from './view';

const select = (state, props) => {
  const selectHasClaimed = makeSelectHasClaimedReward(),
    selectReward = makeSelectRewardByType();

  return {
    currentBalance: selectBalance(state),
    isRewardApproved: selectUserIsRewardApproved(state),
    totalRewardValue: selectUnclaimedRewardValue(state),
  };
};

const perform = dispatch => () => ({
  addBalance: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doNavigate('/getcredits'));
    dispatch(doCloseModal());
  },
  closeModal: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  },
});

export default connect(select, perform)(ModalCreditIntro);
