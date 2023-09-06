import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import SignInVerifyPage from './view';

const select = () => ({});
const perform = {
  doToast,
};

export default connect(select, perform)(SignInVerifyPage);
