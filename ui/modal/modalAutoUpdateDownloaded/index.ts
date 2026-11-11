//@ts-nocheck
import { connect } from "react-redux";
import { doAutoUpdateDeclined, doHideModal } from "redux/actions/app";
import { selectAutoUpdateFailed, selectAutoUpdateDownloading, selectIsUpgradeAvailable } from "redux/selectors/app";
import ModalAutoUpdateDownloaded from "./view";

const select = (state: unknown, props: unknown) => ({
  errorWhileUpdating: selectAutoUpdateFailed(state),
  isDownloading: selectAutoUpdateDownloading(state),
  isUpdateAvailable: selectIsUpgradeAvailable(state),
});

const perform = (dispatch: unknown) => ({
  closeModal: () => dispatch(doHideModal()),
  declineAutoUpdate: () => dispatch(doAutoUpdateDeclined()),
});

export default connect(select, perform)(ModalAutoUpdateDownloaded);
