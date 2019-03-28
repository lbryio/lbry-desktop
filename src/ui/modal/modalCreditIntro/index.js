import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectUserIsRewardApproved, selectUnclaimedRewardValue } from 'lbryinc';
import { selectBalance } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import * as settings from 'constants/settings';
import ModalCreditIntro from './view';
import { navigate } from '@reach/router';

const select = state => ({
  currentBalance: selectBalance(state),
  isRewardApproved: selectUserIsRewardApproved(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
});

const perform = dispatch => () => ({
  addBalance: () => {
    navigate('/$/getcredits');
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doHideModal());
  },
  closeModal: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doHideModal());
  },
});

export default connect(
  select,
  perform
)(ModalCreditIntro);
