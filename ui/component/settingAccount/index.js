import { connect } from 'react-redux';
import { doWalletStatus, selectWalletIsEncrypted } from 'lbry-redux';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectLanguage } from 'redux/selectors/settings';

import SettingAccount from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  user: selectUser(state),
  language: selectLanguage(state),
});

const perform = (dispatch) => ({
  doWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(SettingAccount);
