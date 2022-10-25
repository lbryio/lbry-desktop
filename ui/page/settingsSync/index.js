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
  selectLbrySyncCheckingEmail,
  selectLbrySyncEmailError,
  selectLbrySyncEmailCandidate,
} from 'redux/selectors/sync';

import { doHandleEmail, doLbrysyncRegister, doLbrysyncAuthenticate, doEmailVerifySubscribe } from 'redux/actions/sync';

const select = (state) => ({
  isWalletEncrypted: selectWalletIsEncrypted(state),
  registering: selectLbrySyncRegistering(state),
  registerError: selectLbrySyncRegisterError(state),

  token: selectLbrySyncToken(state),

  authenticating: selectLbrySyncIsAuthenticating(state),

  authError: selectLbrySyncAuthError(state),

  derivingKeys: selectLbrySyncDerivingKeys(state),
  encHmacKey: selectLbrySyncEncryptedHmacKey(state), // ?
  encRootPass: selectLbrySyncEncryptedRoot(state),
  encProviderPass: selectLbrySyncEncryptedProviderPass(state),
  // begin
  // --email
  isCheckingEmail: selectLbrySyncCheckingEmail(state),
  candidateEmail: selectLbrySyncEmailCandidate(state),
  emailError: selectLbrySyncEmailError(state),
  registeredEmail: selectLbrySyncEmail(state),
  saltSeed: selectLbrySyncSaltSeed(state),
  // --password
  // registerError
});

const perform = (dispatch) => ({
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  handleEmail: (email, signUp) => dispatch(doHandleEmail(email, signUp)),
  authenticate: () => dispatch(doLbrysyncAuthenticate()),
  waitForVerify: (stop) => dispatch(doEmailVerifySubscribe(stop)),
  // deriveSecrets: (p, e, s) => dispatch(doDeriveSecrets(p, e, s)),
  register: (password) => dispatch(doLbrysyncRegister(password)),
});

export default connect(select, perform)(SettingsSync);
