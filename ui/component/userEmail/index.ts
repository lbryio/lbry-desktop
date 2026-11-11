//@ts-nocheck
import { connect } from "react-redux";
import { doUserResendVerificationEmail, doUserCheckEmailVerified, doFetchAccessToken } from "redux/actions/user";
import { selectEmailToVerify, selectUser, selectAccessToken } from "redux/selectors/user";
import UserEmailVerify from "./view";

const select = (state: unknown) => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  accessToken: selectAccessToken(state),
});

const perform = (dispatch: unknown) => ({
  resendVerificationEmail: (email) => dispatch(doUserResendVerificationEmail(email)),
  checkEmailVerified: () => dispatch(doUserCheckEmailVerified()),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(select, perform)(UserEmailVerify);
