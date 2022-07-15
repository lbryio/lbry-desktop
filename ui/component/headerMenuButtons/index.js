import { connect } from 'react-redux';
import HeaderMenuButtons from './view';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  doOpenModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(HeaderMenuButtons);
