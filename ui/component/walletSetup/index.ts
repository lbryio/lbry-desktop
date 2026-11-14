//@ts-nocheck
import { connect } from "react-redux";
import { doGetNewAddress } from "redux/actions/wallet";
import WalletSetup from "./view";

// When a wallet has just been made, fetch its receive address so the page fills in.
const perform = (dispatch: Dispatch) => ({
  onWalletReady: () => dispatch(doGetNewAddress()),
});

export default connect(null, perform)(WalletSetup);
