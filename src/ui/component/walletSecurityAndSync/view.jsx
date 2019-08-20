// @flow
import React, { useState, useEffect } from 'react';
import { Form, FormField, Submit } from 'component/common/form';
import Button from 'component/button';
import UserEmail from 'component/userEmail';
import * as ICONS from 'constants/icons';

import { getSavedPassword, setSavedPassword, deleteSavedPassword } from 'util/saved-passwords';
// import { AUTH_ORG } from 'constants/keychain';

/*
On mount: checkSync()
  if
Display on mount
  if !email
    SyncWallet.disabled = true
    SyncWallet.checked = false
    if walletEncrypted
      EncryptWallet.checked = true
      password = savedPassword ? savedPassword : ''
      rememberPassword.checked = savedPassword
    if !walletEncrypted
      password = savedPassword ? savedPassword : ''
      rememberPassword.checked = savedPassword
  else email
    if walletEncrypted
      EncryptWallet.checked = true
      password = savedPassword ? savedPassword : ''
      rememberPassword.checked = savedPassword
      syncEnabled = settings.syncEnabled
      if syncEnabled
        message = 'hi'
      else
        message = 'hi'
    else if !walletEncrypted
      EncryptWallet.checked = false
      password = savedPassword ? savedPassword : ''
      rememberPassword.checked = savedPassword
      syncEnabled = settings.syncEnabled
      if syncEnabled
        message = 'hi'
      else
        message = 'hi'
 */
type Props = {
  // wallet statuses
  walletEncryptSucceeded: boolean,
  walletEncryptPending: boolean,
  walletDecryptSucceeded: boolean,
  walletDecryptPending: boolean,
  updateWalletStatus: boolean,
  walletEncrypted: boolean,
  // wallet methods
  encryptWallet: (?string) => void,
  decryptWallet: (?string) => void,
  updateWalletStatus: () => void,
  // housekeeping
  setPasswordSaved: () => void,
  syncEnabled: boolean,
  setClientSetting: (string, boolean | string) => void,
  isPasswordSaved: boolean,
  // data
  user: any,
  // sync statuses
  hasSyncedWallet: boolean,
  getSyncIsPending?: boolean,
  syncApplyErrorMessage?: string,
  hashChanged: boolean,
  // sync data
  syncData: string | null,
  syncHash: string | null,
  // sync methods
  syncApply: (string | null, string | null, string) => void,
  checkSync: () => void,
  setDefaultAccount: () => void,
  hasTransactions: boolean,
};

type State = {
  newPassword: string,
  newPasswordConfirm: string,
  passwordMatch: boolean,
  understandConfirmed: boolean,
  understandError: boolean,
  submitted: boolean,
  failMessage: ?string,
  rememberPassword: boolean,
  showEmailReg: boolean,
  failed: boolean,
  enableSync: boolean,
  encryptWallet: boolean,
  obscurePassword: boolean,
};

function WalletSecurityAndSync(props: Props) {
  const {
    // walletEncryptSucceeded,
    // walletEncryptPending,
    // walletDecryptSucceeded,
    // walletDecryptPending,
    // updateWalletStatus,
    walletEncrypted,
    encryptWallet,
    decryptWallet,
    // setPasswordSaved,
    syncEnabled,
    // setClientSetting,
    // isPasswordSaved,
    user,
    hasSyncedWallet,
    getSyncIsPending,
    syncApplyErrorMessage,
    hashChanged,
    syncData,
    syncHash,
    syncApply,
    checkSync,
    hasTransactions,
    // setDefaultAccount,
  } = props;

  const defaultComponentState: State = {
    newPassword: '',
    newPasswordConfirm: '',
    passwordMatch: false,
    understandConfirmed: false,
    understandError: false,
    submitted: false, // Prior actions could be marked complete
    failMessage: undefined,
    rememberPassword: false,
    showEmailReg: false,
    failed: false,
    enableSync: syncEnabled,
    encryptWallet: walletEncrypted,
    obscurePassword: true,
  };
  const [componentState, setComponentState] = useState<State>(defaultComponentState);

  const safeToSync = !hasTransactions || !hashChanged;

  useEffect(() => {
    checkSync();
  }, []);
  useEffect(() => {
    setComponentState({
      ...componentState,
      passwordMatch: componentState.newPassword === componentState.newPasswordConfirm,
    });
  }, [componentState.newPassword, componentState.newPasswordConfirm]);

  const isEmailVerified = user && user.primary_email && user.has_verified_email;
  // const syncDisabledMessage = 'You cannot sync without an email';

  function onChangeNewPassword(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, newPassword: event.target.value });
  }

  function onChangeRememberPassword(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, rememberPassword: event.target.checked });
  }

  function onChangeNewPasswordConfirm(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, newPasswordConfirm: event.target.value });
  }

  function onChangeUnderstandConfirm(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, understandConfirmed: /^.?i understand.?$/i.test(event.target.value) });
  }

  function onChangeSync(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, enableSync: event.target.checked });
  }

  function onChangeEncrypt(event: SyntheticInputEvent<>) {
    setComponentState({ ...componentState, encryptWallet: event.target.checked });
  }

  async function apply() {
    setComponentState({ ...componentState, failed: false });

    await checkSync();
    if (componentState.enableSync) {
      await syncApply(syncHash, syncData, componentState.newPassword);
      if (syncApplyErrorMessage) {
        setComponentState({ ...componentState, failed: true });
      }
    }
    await decryptWallet();
    if (componentState.failed !== true) {
      await encryptWallet(componentState.newPassword);
    }
    if (componentState.encryptWallet) {
      await encryptWallet(componentState.newPassword);
    }

    if (componentState.failed === false) {
    }
    // this.setState({ submitted: true });
    // this.props.encryptWallet(state.newPassword);
  }

  return (
    <section className="card card--section">
      <h2 className="card__title">{__('Wallet Sync and Security')}</h2>
      {!isEmailVerified && (
        <React.Fragment>
          <p className="card__subtitle">
            {__(`It looks like we don't have your email.`)}{' '}
            <Button
              button="link"
              label={__('Verify your email')}
              onClick={() => setComponentState({ ...componentState, showEmailReg: !componentState.showEmailReg })}
            />{' '}
            {__(`and then come back here.`)}
          </p>
          {componentState.showEmailReg && <UserEmail />}
        </React.Fragment>
      )}
      <Form onSubmit={() => apply()}>
        <p>
          {__(
            'Your LBRY password can help you encrypt your wallet or sync it to another device. You must use the same LBRY password on every device if you wish to sync.'
          )}{' '}
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
        </p>
        <fieldset-section>
          <FormField
            autoFocus
            inputButton={
              <Button
                icon={componentState.obscurePassword ? ICONS.EYE : ICONS.EYE_OFF}
                button={'primary'}
                onClick={() =>
                  setComponentState({ ...componentState, obscurePassword: !componentState.obscurePassword })
                }
              />
            }
            label={__('Password')}
            placeholder={__('Shh...')}
            type={componentState.obscurePassword ? 'password' : 'text'}
            name="wallet-new-password"
            onChange={event => onChangeNewPassword(event)}
          />
        </fieldset-section>
        <fieldset-section>
          <FormField
            error={componentState.passwordMatch === false ? 'No match' : false}
            label={__('Same Password')}
            placeholder={__('Your eyes only')}
            type="password"
            name="wallet-new-password-confirm"
            onChange={event => onChangeNewPasswordConfirm(event)}
          />
        </fieldset-section>

        <fieldset-section>
          <FormField
            label={__('Remember Password')}
            type="checkbox"
            name="wallet-remember-password"
            onChange={event => onChangeRememberPassword(event)}
            checked={componentState.rememberPassword}
          />
          <FormField
            type="checkbox"
            name="encrypt_enabled"
            checked={componentState.encryptWallet}
            disabled={false}
            onChange={event => onChangeEncrypt(event)}
            label={__('Encrypt Wallet')}
          />

          <FormField
            type="checkbox"
            name="sync_enabled"
            checked={componentState.enableSync}
            disabled={!isEmailVerified || !safeToSync}
            error={!!syncApplyErrorMessage && syncApplyErrorMessage}
            helper={!!syncApplyErrorMessage && syncApplyErrorMessage}
            prefix={<span className="badge badge--alert">ALPHA</span>}
            onChange={event => onChangeSync(event)}
            label={
              <React.Fragment>
                {__('Enable Sync')} <Button button="link" label={__('(?)')} href="https://lbry.com/privacypolicy" />{' '}
                <span className="badge badge--alert">ALPHA</span>
              </React.Fragment>
            }
          />
        </fieldset-section>

        <div className="card__subtitle--status">
          {__(
            'If your password is lost, it cannot be recovered. You will not be able to access your wallet without a password.'
          )}
        </div>
        <FormField
          error={componentState.understandError === true ? 'You must enter "I understand"' : false}
          label={__('Enter "I understand"')}
          placeholder={__('I understand')}
          type="text"
          name="wallet-understand"
          onChange={event => onChangeUnderstandConfirm(event)}
        />
        {componentState.failMessage && <div className="error-text">{__(componentState.failMessage)}</div>}
        <Submit
          disabled={!componentState.passwordMatch}
          label={componentState.failMessage ? __('Encrypting Wallet') : __('Apply')}
        />
      </Form>
      testing stuff
      <Button
        button="primary"
        label={__('Sync Apply')}
        onClick={() => syncApply(syncHash, syncData, componentState.newPassword)}
      />{' '}
      <Button button="primary" label={__('Check Sync')} onClick={() => checkSync()} />{' '}
      <Button button="primary" label={__('Setpass test')} onClick={() => setSavedPassword('test', 'testpass')} />{' '}
      <Button
        button="primary"
        label={__('Getpass test')}
        onClick={() => getSavedPassword('test').then(p => setComponentState({ ...componentState, newPassword: p }))}
      />{' '}
      <Button button="primary" label={__('Deletepass test')} onClick={() => deleteSavedPassword('test')} />{' '}
      <p>password: {componentState.newPassword}</p>
      <p>encryptWallet: {String(componentState.encryptWallet)}</p>
      <p>enableSync: {String(componentState.enableSync)}</p>
      <p>syncApplyError: {String(syncApplyErrorMessage)}</p>
      <p>Has Synced: {String(hasSyncedWallet)}</p>
      <p>getSyncPending: {String(getSyncIsPending)}</p>
      <p>syncEnabled: {String(syncEnabled)}</p>
      <p>syncHash: {syncHash ? syncHash.slice(0, 10) : 'null'}</p>
      <p>syncData: {syncData ? syncData.slice(0, 10) : 'null'}</p>
      <p>walletEncrypted: {String(walletEncrypted)}</p>
      <p>emailRegistered: {String(isEmailVerified)}</p>
      <p>hashChanged: {String(hashChanged)}</p>
    </section>
  );
}

export default WalletSecurityAndSync;
