import { connect } from 'react-redux';
import { selectReceiveAddress, selectGettingNewAddress } from 'redux/selectors/wallet';
import { doCheckAddressIsMine, doGetNewAddress } from 'redux/actions/wallet';
import WalletAddress from './view';
import { withRouter } from 'react-router';

const select = (state) => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
});

const perform = (dispatch) => ({
  checkAddressIsMine: (address) => dispatch(doCheckAddressIsMine(address)),
  getNewAddress: () => dispatch(doGetNewAddress()),
});

export default withRouter(connect(select, perform)(WalletAddress));
