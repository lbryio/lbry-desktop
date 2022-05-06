import { connect } from 'react-redux';
import { doDismissToast } from 'redux/actions/notifications';
import { selectToast, selectToastCount } from 'redux/selectors/notifications';
import SnackBar from './view';

const perform = (dispatch) => ({
  removeSnack: () => dispatch(doDismissToast()),
});

const select = (state) => ({
  snack: selectToast(state),
  snackCount: selectToastCount(state),
});

export default connect(select, perform)(SnackBar);
