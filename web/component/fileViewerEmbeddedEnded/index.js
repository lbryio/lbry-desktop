import { connect } from 'react-redux';
import fileViewerEmbeddedEnded from './view';
import { selectUserVerifiedEmail } from 'lbryinc';

export default connect(state => ({
  isAuthenticated: selectUserVerifiedEmail(state),
}))(fileViewerEmbeddedEnded);
