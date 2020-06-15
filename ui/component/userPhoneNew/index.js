import { connect } from 'react-redux';
import { selectPhoneNewErrorMessage } from 'redux/selectors/user';
import { doUserPhoneNew } from 'redux/actions/user';
import UserPhoneNew from './view';

const select = state => ({
  phoneErrorMessage: selectPhoneNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserPhone: (phone, countryCode) => dispatch(doUserPhoneNew(phone, countryCode)),
});

export default connect(select, perform)(UserPhoneNew);
