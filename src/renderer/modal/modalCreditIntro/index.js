import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectUserIsRewardApproved, selectUnclaimedRewardValue } from 'lbryinc';
import { selectBalance } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import * as settings from 'constants/settings';
import ModalCreditIntro from './view';

const select = state => ({
  currentBalance: selectBalance(state),
  isRewardApproved: selectUserIsRewardApproved(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
});

const perform = dispatch => () => ({
  addBalance: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doNavigate('/getcredits'));
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
