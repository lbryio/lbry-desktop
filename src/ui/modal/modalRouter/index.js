import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  selectCostForCurrentPageUri,
  selectBalance,
  selectCurrentPage,
  selectError,
  doToast,
} from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectUser, selectUserIsVerificationCandidate } from 'lbryinc';
import { selectModal } from 'redux/selectors/app';
import { doOpenModal } from 'redux/actions/app';
import ModalRouter from './view';

const select = state => ({
  balance: selectBalance(state),
  showPageCost: selectCostForCurrentPageUri(state),
  page: selectCurrentPage(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
  isCreditIntroAcknowledged: makeSelectClientSetting(settings.CREDIT_REQUIRED_ACKNOWLEDGED)(state),
  isEmailCollectionAcknowledged: makeSelectClientSetting(settings.EMAIL_COLLECTION_ACKNOWLEDGED)(
    state
  ),
  isWelcomeAcknowledged: makeSelectClientSetting(settings.NEW_USER_ACKNOWLEDGED)(state),
  user: selectUser(state),
  modal: selectModal(state),
  error: selectError(state),
});

const perform = dispatch => ({
  showToast: props => dispatch(doToast(props)),
  openModal: props => dispatch(doOpenModal(props)),
});

export default connect(
  select,
  perform
)(ModalRouter);
