import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'lbryinc';
import { selectScrollStartingPosition } from 'redux/selectors/app';
import Router from './view';

const select = state => ({
  currentScroll: selectScrollStartingPosition(state),
  isAuthenticated: selectUserVerifiedEmail(state),
});

export default connect(select)(Router);
