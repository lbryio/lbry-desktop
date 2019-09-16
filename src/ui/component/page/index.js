import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'lbryinc';
import Page from './view';

const select = state => ({
  authenticated: Boolean(selectUserVerifiedEmail(state)),
});

export default connect(select)(Page);
