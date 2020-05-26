import { connect } from 'react-redux';
import { selectGettingNewAddress, selectReceiveAddress, doGetNewAddress } from 'lbry-redux';
import { selectUserEmail } from 'lbryinc';
import BuyPage from './view';

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
  email: selectUserEmail(state),
});

export default connect(select, {
  doGetNewAddress,
})(BuyPage);
