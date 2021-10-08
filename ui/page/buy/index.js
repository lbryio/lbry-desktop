import { connect } from 'react-redux';
import { selectGettingNewAddress, selectReceiveAddress } from 'redux/selectors/wallet';
import { doGetNewAddress } from 'redux/actions/wallet';
import { selectUserEmail, selectUser } from 'redux/selectors/user';
import { doUserSetCountry } from 'redux/actions/user';
import BuyPage from './view';

const select = (state) => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
  email: selectUserEmail(state),
  user: selectUser(state),
});

export default connect(select, {
  doGetNewAddress,
  doUserSetCountry,
})(BuyPage);
