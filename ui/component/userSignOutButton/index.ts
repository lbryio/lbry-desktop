//@ts-nocheck
import { connect } from "react-redux";
import { doSignOut } from "redux/actions/app";
import { doClearEmailEntry, doClearPasswordEntry } from "redux/actions/user";
import UserSignOutButton from "./view";

const select = (state: unknown) => ({});

export default connect(select, {
  doSignOut,
  doClearEmailEntry,
  doClearPasswordEntry,
})(UserSignOutButton);
