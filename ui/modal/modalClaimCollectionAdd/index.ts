//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import ClaimCollectionAdd from "./view";

const select = (state: unknown) => ({});

const perform = {
  doHideModal,
} as const;

export default connect(select, perform)(ClaimCollectionAdd);
