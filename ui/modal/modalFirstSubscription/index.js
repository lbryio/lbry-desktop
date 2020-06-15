import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectAccessToken, selectUser } from 'redux/selectors/user';
import { withRouter } from 'react-router';

import ModalFirstSubscription from './view';

const select = state => ({
  accessToken: selectAccessToken(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => dispatch(doHideModal()),
});

export default withRouter(connect(select, perform)(ModalFirstSubscription));
