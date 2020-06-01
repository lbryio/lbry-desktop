import { connect } from 'react-redux';
import { selectGettingNewAddress, selectReceiveAddress, doGetNewAddress } from 'lbry-redux';
import { selectUserEmail, selectUser, doUserSetCountry } from 'lbryinc';
import BuyPage from './view';

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
  email: selectUserEmail(state),
  user: selectUser(state),
});

export default connect(select, {
  doGetNewAddress,
  doUserSetCountry,
})(BuyPage);
