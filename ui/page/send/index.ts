//@ts-nocheck
import { connect } from "react-redux";
import SendPage from "./view";

const select = (state: unknown) => ({});

export default connect(select, null)(SendPage);
