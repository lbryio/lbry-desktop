import { connect } from 'react-redux';
import fileViewerEmbeddedEnded from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

export default connect(state => ({
  isAuthenticated: selectUserVerifiedEmail(state),
}))(fileViewerEmbeddedEnded);
