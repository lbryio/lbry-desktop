import { connect } from 'react-redux';
import { doShowSnackBar } from 'redux/actions/app';
import ReportPage from './view';

export default connect(null, {
  doShowSnackBar,
})(ReportPage);
