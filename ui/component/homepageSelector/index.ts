//@ts-nocheck
import { connect } from "react-redux";
import SelectHomepage from "./view";
import { doSetHomepage } from "redux/actions/settings";
import { selectHomepageCode } from "redux/selectors/settings";

const select = (state: unknown) => ({
  homepage: selectHomepageCode(state),
});

const perform = (dispatch: Dispatch) => ({
  setHomepage: (value) => dispatch(doSetHomepage(value)),
});

export default connect(select, perform)(SelectHomepage);
