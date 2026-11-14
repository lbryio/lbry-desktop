//@ts-nocheck
import { connect } from "react-redux";
import { doToast } from "redux/actions/notifications";
import SignInWalletPasswordPage from "./view";

const select = () => ({});
const perform = {
  doToast,
} as const;

export default connect(select, perform)(SignInWalletPasswordPage);
