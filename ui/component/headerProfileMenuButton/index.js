import { connect } from 'react-redux';
import { doSignOut } from 'redux/actions/app';
import { selectDefaultChannelClaim } from 'redux/selectors/settings';
import { selectMyChannelClaimIds } from 'redux/selectors/claims';
import { selectUserEmail, selectUserVerifiedEmail } from 'redux/selectors/user';
import HeaderProfileMenuButton from './view';

const select = (state) => ({
  myChannelClaimIds: selectMyChannelClaimIds(state),
  defaultChannelClaim: selectDefaultChannelClaim(state),
  authenticated: selectUserVerifiedEmail(state),
  email: selectUserEmail(state),
});

const perform = (dispatch) => ({
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(HeaderProfileMenuButton);
