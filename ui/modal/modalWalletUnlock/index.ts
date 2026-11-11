//@ts-nocheck
import { connect } from "react-redux";
import { doWalletUnlock } from "redux/actions/wallet";
import { selectWalletUnlockSucceeded } from "redux/selectors/wallet";
import { doQuit, doHideModal } from "redux/actions/app";
import ModalWalletUnlock from "./view";

const select = (state: unknown) => ({
  walletUnlockSucceded: selectWalletUnlockSucceeded(state),
});

const perform = (dispatch: unknown) => ({
  closeModal: () => dispatch(doHideModal()),
  quit: () => dispatch(doQuit()),
  unlockWallet: (password) => dispatch(doWalletUnlock(password)),
});

export default connect(select, perform)(ModalWalletUnlock);
