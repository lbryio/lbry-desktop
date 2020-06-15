import { connect } from 'react-redux';
import { doUserPhoneVerify, doUserPhoneReset } from 'redux/actions/user';
import { selectPhoneToVerify, selectPhoneVerifyErrorMessage, selectUserCountryCode } from 'redux/selectors/user';
import UserPhoneVerify from './view';

const select = state => ({
  phone: selectPhoneToVerify(state),
  countryCode: selectUserCountryCode(state),
  phoneErrorMessage: selectPhoneVerifyErrorMessage(state),
});

const perform = dispatch => ({
  resetPhone: () => dispatch(doUserPhoneReset()),
  verifyUserPhone: code => dispatch(doUserPhoneVerify(code)),
});

export default connect(select, perform)(UserPhoneVerify);
