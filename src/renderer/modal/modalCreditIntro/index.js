import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectUserIsRewardApproved } from 'redux/selectors/user';
import { selectBalance, doCloseModal, doNavigate } from 'lbry-redux';
import { selectUnclaimedRewardValue } from 'redux/selectors/rewards';
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
    dispatch(doCloseModal());
  },
  closeModal: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  },
});

export default connect(select, perform)(ModalCreditIntro);
