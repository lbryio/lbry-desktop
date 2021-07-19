import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import StripeAccountConnection from './view';
import { selectUser } from 'redux/selectors/user';

// function that receives state parameter and returns object of functions that accept  state
const select = (state) => ({
  user: selectUser(state),
});

// const perform = (dispatch) => ({});

export default withRouter(connect(select)(StripeAccountConnection));
