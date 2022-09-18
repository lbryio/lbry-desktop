import { connect } from 'react-redux';
import SettingsSync from './view';
import { selectWalletIsEncrypted } from 'redux/selectors/wallet';
import { doNotifyEncryptWallet, doNotifyDecryptWallet, doNotifyForgetPassword } from 'redux/actions/app';

import {
  selectLbrySyncRegistering,
  selectLbrySyncEmail,
  selectLbrySyncRegisterError,
  selectLbrySyncGettingSalt,
  selectLbrySyncSaltError,
  selectLbrySyncSaltSeed,
  selectLbrySyncToken,
  selectLbrySyncIsAuthenticating,
  selectLbrySyncAuthError,
  selectLbrySyncDerivingKeys,
  selectLbrySyncEncryptedHmacKey,
  selectLbrySyncEncryptedRoot,
  selectLbrySyncEncryptedProviderPass,
} from 'redux/selectors/lbrysync';

import {
  doLbrysyncGetSalt,
  doLbrysyncRegister,
  doGenerateSaltSeed,
  doDeriveSecrets,
  doLbrysyncAuthenticate,
} from 'redux/actions/lbrysync';

const select = (state) => ({
  walletEncrypted: selectWalletIsEncrypted(state),
  registering: selectLbrySyncRegistering(state),
  registeredEmail: selectLbrySyncEmail(state),
  registerError: selectLbrySyncRegisterError(state),

  gettingSalt: selectLbrySyncGettingSalt(state),
  saltError: selectLbrySyncSaltError(state),
  saltSeed: selectLbrySyncSaltSeed(state),
  token: selectLbrySyncToken(state),

  authenticating: selectLbrySyncIsAuthenticating(state),

  authError: selectLbrySyncAuthError(state),

  derivingKeys: selectLbrySyncDerivingKeys(state),
  encHmacKey: selectLbrySyncEncryptedHmacKey(state), // ?
  encRootPass: selectLbrySyncEncryptedRoot(state),
  encProviderPass: selectLbrySyncEncryptedProviderPass(state),
});

const perform = (dispatch) => ({
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  getSalt: (email) => dispatch(doLbrysyncGetSalt(email)),
  generateSaltSeed: () => dispatch(doGenerateSaltSeed()),
  authenticate: () => dispatch(doLbrysyncAuthenticate()),
  deriveSecrets: (p, e, s) => dispatch(doDeriveSecrets(p, e, s)),
  register: (email, secrets, saltseed) => dispatch(doLbrysyncRegister(email, secrets, saltseed)),
});

export default connect(select, perform)(SettingsSync);
