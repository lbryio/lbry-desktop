import { connect } from 'react-redux';
import { selectGettingNewAddress, selectReceiveAddress, doGetNewAddress } from 'lbry-redux';
import { selectUserEmail, selectUser } from 'redux/selectors/user';
import { doUserSetCountry } from 'redux/actions/user';
import WalletBuy from './view';

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
  email: selectUserEmail(state),
  user: selectUser(state),
});

export default connect(select, {
  doGetNewAddress,
  doUserSetCountry,
})(WalletBuy);
