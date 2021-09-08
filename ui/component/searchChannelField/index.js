import { connect } from 'react-redux';
import { doToast } from 'redux/actions/notifications';
import SearchChannelField from './view';

const perform = (dispatch) => ({
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(null, perform)(SearchChannelField);
