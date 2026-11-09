//@ts-nocheck
import {connect} from 'react-redux';
import { doDismissToast } from 'redux/actions/notifications';
import { selectToast } from 'redux/selectors/notifications';
import SnackBar from './view';

const perform = dispatch: unknown => ({
  removeSnack: () => dispatch(doDismissToast()),
});

const select = state: unknown => ({
  snack: selectToast(state),
});

export default connect(select, perform)(SnackBar);
