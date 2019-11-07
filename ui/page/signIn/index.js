import { connect } from 'react-redux';
import SignUpPage from './view';

const select = () => ({});
const perform = () => ({});

export default connect(
  select,
  perform
)(SignUpPage);
