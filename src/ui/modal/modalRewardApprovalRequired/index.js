import * as PAGES from 'constants/pages';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { withRouter } from 'react-router-dom';
import ModalRewardApprovalRequired from './view';

const perform = (dispatch, ownProps) => ({
  doAuth: () => {
    const {
      location: { pathname },
      history,
    } = ownProps;
    const currentPath = pathname.split('/$/')[1];
    dispatch(doHideModal());
    history.push(`/$/${PAGES.AUTH}?redirect=${currentPath}`);
  },
  closeModal: () => dispatch(doHideModal()),
});

export default withRouter(
  connect(
    null,
    perform
  )(ModalRewardApprovalRequired)
);
