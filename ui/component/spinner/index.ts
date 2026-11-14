//@ts-nocheck
import { connect } from "react-redux";
import { selectTheme } from "redux/selectors/settings";
import Spinner from "./view";

const mapStateToProps = (state: unknown) => ({
  theme: selectTheme(state),
});

export default connect(mapStateToProps, null)(Spinner);
