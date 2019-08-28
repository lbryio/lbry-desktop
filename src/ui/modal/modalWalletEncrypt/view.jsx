// @flow
import React from 'react';
import { Form, FormField, Submit } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { setSavedPassword } from 'util/saved-passwords';

type Props = {
  closeModal: () => void,
  walletEncryptSucceded: boolean,
  updateWalletStatus: boolean,
  encryptWallet: (?string) => void,
  updateWalletStatus: () => void,
};

type State = {
  newPassword: ?string,
  newPasswordConfirm: ?string,
  passwordMismatch: boolean,
  understandConfirmed: boolean,
  understandError: boolean,
  submitted: boolean,
  failMessage: ?string,
  rememberPassword: boolean,
};

class ModalWalletEncrypt extends React.PureComponent<Props, State> {
  state = {
    newPassword: null,
    newPasswordConfirm: null,
    passwordMismatch: false,
    understandConfirmed: false,
    understandError: false,
    submitted: false, // Prior actions could be marked complete
    failMessage: undefined,
    rememberPassword: false,
  };

  componentDidUpdate() {
    const { props, state } = this;

    if (state.submitted) {
      if (props.walletEncryptSucceded === true) {
        props.closeModal();
        props.updateWalletStatus();
      } else if (props.walletEncryptSucceded === false) {
        // See https://github.com/lbryio/lbry/issues/1307
        this.setState({ failMessage: 'Unable to encrypt wallet.' });
      }
    }
  }

  onChangeNewPassword(event: SyntheticInputEvent<>) {
    this.setState({ newPassword: event.target.value });
  }

  onChangeRememberPassword(event: SyntheticInputEvent<>) {
    this.setState({ rememberPassword: event.target.checked });
  }

  onChangeNewPasswordConfirm(event: SyntheticInputEvent<>) {
    this.setState({ newPasswordConfirm: event.target.value });
  }

  onChangeUnderstandConfirm(event: SyntheticInputEvent<>) {
    this.setState({
      understandConfirmed: /^.?i understand.?$/i.test(event.target.value),
    });
  }

  submitEncryptForm() {
    const { state } = this;

    let invalidEntries = false;

    if (state.newPassword !== state.newPasswordConfirm) {
      this.setState({ passwordMismatch: true });
      invalidEntries = true;
    }

    if (state.understandConfirmed === false) {
      this.setState({ understandError: true });
      invalidEntries = true;
    }

    if (invalidEntries === true) {
      return;
    }
    if (state.rememberPassword === true) {
      setSavedPassword(state.newPassword);
    }
    this.setState({ submitted: true });
    this.props.encryptWallet(state.newPassword);
  }

  render() {
    const { closeModal } = this.props;

    const { passwordMismatch, understandError, failMessage } = this.state;
    return (
      <Modal
        isOpen
        title={__('Encrypt Wallet')}
        contentLabel={__('Encrypt Wallet')}
        type="custom"
        onConfirmed={() => this.submitEncryptForm()}
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.submitEncryptForm()}>
          <p>
            {__(
              'Encrypting your wallet will require a password to access your local wallet data when LBRY starts. Please enter a new password for your wallet.'
            )}{' '}
            <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
          </p>
          <fieldset-section>
            <FormField
              autoFocus
              error={passwordMismatch === true ? 'Passwords do not match' : false}
              label={__('Password')}
              placeholder={__('Shh...')}
              type="password"
              name="wallet-new-password"
              onChange={event => this.onChangeNewPassword(event)}
            />
          </fieldset-section>
          <fieldset-section>
            <FormField
              error={passwordMismatch === true ? 'Passwords do not match' : false}
              label={__('Confirm Password')}
              placeholder={__('Your eyes only')}
              type="password"
              name="wallet-new-password-confirm"
              onChange={event => this.onChangeNewPasswordConfirm(event)}
            />
          </fieldset-section>
          <fieldset-section>
            <FormField
              label={__('Remember Password')}
              type="checkbox"
              name="wallet-remember-password"
              onChange={event => this.onChangeRememberPassword(event)}
              checked={this.state.rememberPassword}
            />
          </fieldset-section>

          <div className="card__subtitle--status">
            {__(
              'If your password is lost, it cannot be recovered. You will not be able to access your wallet without a password.'
            )}
          </div>
          <FormField
            inputButton={<Submit label={failMessage ? __('Encrypting Wallet') : __('Encrypt Wallet')} />}
            error={understandError === true ? 'You must enter "I understand"' : false}
            label={__('Enter "I understand"')}
            placeholder={__('Dear computer, I understand')}
            type="text"
            name="wallet-understand"
            onChange={event => this.onChangeUnderstandConfirm(event)}
          />
          {failMessage && <div className="error-text">{__(failMessage)}</div>}
        </Form>
        <div className="card__actions">
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Modal>
    );
  }
}

export default ModalWalletEncrypt;
