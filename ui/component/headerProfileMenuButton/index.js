import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectUserEmail, selectUserVerifiedEmail } from 'redux/selectors/user';
import * as MODALS from 'constants/modal_types';
import HeaderProfileMenuButton from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  email: selectUserEmail(state),
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  openSignOutModal: () => dispatch(doOpenModal(MODALS.SIGN_OUT)),
});

export default connect(select, perform)(HeaderProfileMenuButton);
