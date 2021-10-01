import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import StripeAccountConnection from './view';
import { doToast } from 'redux/actions/notifications';

const select = (state) => ({});

const perform = (dispatch) => ({
  doToast: (options) => dispatch(doToast(options)),
});

export default withRouter(connect(select, perform)(StripeAccountConnection));
