import { connect } from 'react-redux';
import { selectBalance, selectMyChannelClaims, makeSelectClaimForUri } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import WalletSend from './view';
import { withRouter } from 'react-router';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

const select = (state, props) => ({
  balance: selectBalance(state),
  channels: selectMyChannelClaims(state),
  contentClaim: makeSelectClaimForUri(props.contentUri)(state),
});

export default withRouter(connect(select, perform)(WalletSend));
