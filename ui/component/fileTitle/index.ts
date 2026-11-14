//@ts-nocheck
import { connect } from "react-redux";
import { selectTitleForUri } from "redux/selectors/claims";
import FileTitleSection from "./view";

const select = (state: unknown, props: unknown) => ({
  title: selectTitleForUri(state, props.uri),
});

export default connect(select)(FileTitleSection);
