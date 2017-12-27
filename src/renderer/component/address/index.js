import { connect } from 'react-redux';
import { doShowSnackBar } from 'redux/actions/app';
import Address from './view';

export default connect(null, {
  doShowSnackBar,
})(Address);
