import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import WalletSend from './view';
import { withRouter } from 'react-router';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

const select = state => ({
  balance: selectBalance(state),
});

export default withRouter(
  connect(
    select,
    perform
  )(WalletSend)
);
