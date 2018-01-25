import { connect } from 'react-redux';
import { doSendDraftTransaction } from 'redux/actions/wallet';
import WalletSend from './view';

const perform = dispatch => ({
  sendToAddress: values => dispatch(doSendDraftTransaction(values)),
});

export default connect(null, perform)(WalletSend);
