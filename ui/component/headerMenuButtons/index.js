import { connect } from 'react-redux';
import HeaderMenuButtons from './view';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';
import { doClearPublish } from 'redux/actions/publish';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  clearPublish: () => dispatch(doClearPublish()),
});

export default connect(select, perform)(HeaderMenuButtons);
