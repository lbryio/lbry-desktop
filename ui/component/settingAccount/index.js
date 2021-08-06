import { connect } from 'react-redux';
import { doWalletStatus, selectWalletIsEncrypted } from 'lbry-redux';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import SettingAccount from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  doWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(SettingAccount);
