import { connect } from 'react-redux';
import { doSignOut } from 'redux/actions/app';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectUserEmail, selectUserVerifiedEmail } from 'redux/selectors/user';
import HeaderProfileMenuButton from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  authenticated: selectUserVerifiedEmail(state),
  email: selectUserEmail(state),
});

const perform = (dispatch) => ({
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(HeaderProfileMenuButton);
