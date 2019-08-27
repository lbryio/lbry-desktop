import { connect } from 'react-redux';
import { selectEmailToVerify, selectUser } from 'lbryinc';
import { selectMyChannelClaims } from 'lbry-redux';
import SignUpPage from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
  channels: selectMyChannelClaims(state),
});

export default connect(
  select,
  null
)(SignUpPage);
