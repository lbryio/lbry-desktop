import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import Pixel from './view';

const select = (state) => ({
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
});

export default connect(select)(Pixel);
