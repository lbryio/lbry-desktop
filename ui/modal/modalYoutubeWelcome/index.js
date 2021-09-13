import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import WalletSend from './view';

const select = state => ({});

const perform = {
  doHideModal,
};

export default connect(
  select,
  perform
)(WalletSend);
