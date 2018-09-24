import { connect } from 'react-redux';
import { selectPhoneNewErrorMessage, doUserPhoneNew } from 'lbryinc';
import UserPhoneNew from './view';

const select = state => ({
  phoneErrorMessage: selectPhoneNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserPhone: (phone, countryCode) => dispatch(doUserPhoneNew(phone, countryCode)),
});

export default connect(
  select,
  perform
)(UserPhoneNew);
