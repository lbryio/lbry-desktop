import { connect } from 'react-redux';
import { doSendDraftTransaction, selectBalance } from 'lbry-redux';
import WalletSend from './view';

const perform = dispatch => ({
  sendToAddress: values => dispatch(doSendDraftTransaction(values)),
});

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, perform)(WalletSend);
