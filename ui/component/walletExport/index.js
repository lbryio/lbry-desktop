import WalletExport from './view';
import { doToast } from 'redux/actions/notifications';
import { connect } from 'react-redux';

const perform = (dispatch) => ({
  toast: (message, isError) => dispatch(doToast({ message, isError })),
});

export default connect(null, perform)(WalletExport);
