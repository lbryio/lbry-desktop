import { connect } from 'react-redux';
import { selectHasChannels } from 'redux/selectors/claims';
import { selectWalletIsEncrypted } from 'redux/selectors/wallet';
import { doWalletStatus } from 'redux/actions/wallet';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';

import SettingAccount from './view';

const select = (state) => ({
  isAuthenticated: selectUserVerifiedEmail(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  user: selectUser(state),
  hasChannels: selectHasChannels(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(SettingAccount);
