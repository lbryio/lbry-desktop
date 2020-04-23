import { connect } from 'react-redux';
import { makeSelectTitleForUri, makeSelectClaimForUri, selectIsSendingSupport, selectBalance } from 'lbry-redux';
import WalletSendTip from './view';
import { doOpenModal } from 'redux/actions/app';
import { withRouter } from 'react-router';

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri, false)(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default withRouter(connect(select, perform)(WalletSendTip));
