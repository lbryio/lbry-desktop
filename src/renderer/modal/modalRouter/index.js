import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  doNotify,
  selectCostForCurrentPageUri,
  selectBalance,
  selectCurrentPage,
  selectNotification,
  selectNotificationProps,
} from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectUser, selectUserIsVerificationCandidate } from 'lbryinc';

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
  notification: selectNotification(state),
  notificationProps: selectNotificationProps(state),
});

const perform = dispatch => ({
  openModal: notification => dispatch(doNotify(notification)),
});

export default connect(
  select,
  perform
)(ModalRouter);
