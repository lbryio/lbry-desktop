import { connect } from 'react-redux';
import { selectToast, doDismissToast } from 'lbry-redux';
import SnackBar from './view';

const perform = dispatch => ({
  removeSnack: () => dispatch(doDismissToast()),
});

const select = state => ({
  snack: selectToast(state),
});

export default connect(
  select,
  perform
)(SnackBar);
