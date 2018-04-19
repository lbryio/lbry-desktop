import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectUserIsRewardApproved } from 'redux/selectors/user';
import { selectBalance, doHideNotification } from 'lbry-redux';
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
    dispatch(doHideNotification());
  },
  closeModal: () => {
    dispatch(doSetClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED, true));
    dispatch(doHideNotification());
  },
});

export default connect(select, perform)(ModalCreditIntro);
