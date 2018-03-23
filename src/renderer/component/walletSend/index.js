import { connect } from 'react-redux';
import { doSendDraftTransaction } from 'redux/actions/wallet';
import { selectBalance } from 'redux/selectors/wallet';
import WalletSend from './view';

const perform = dispatch => ({
  sendToAddress: values => dispatch(doSendDraftTransaction(values)),
});

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, perform)(WalletSend);
