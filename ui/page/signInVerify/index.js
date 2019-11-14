import { connect } from 'react-redux';
import { doToast } from 'lbry-redux';
import SignInVerifyPage from './view';

const select = () => ({});
const perform = {
  doToast,
};

export default connect(
  select,
  perform
)(SignInVerifyPage);
