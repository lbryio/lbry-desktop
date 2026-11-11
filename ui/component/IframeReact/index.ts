//@ts-nocheck
import { connect } from "react-redux";
import IframeReact from "./view";

const select = (state: unknown) => ({});

const perform = () => ({});

export default connect(select, perform)(IframeReact);
