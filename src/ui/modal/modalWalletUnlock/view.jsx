// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { getSavedPassword, setSavedPassword } from 'util/saved-passwords';

type Props = {
  quit: () => void,
  closeModal: () => void,
  unlockWallet: (?string) => void,
  walletUnlockSucceded: boolean,
};

type State = {
  password: string,
  rememberPassword: boolean,
};

class ModalWalletUnlock extends React.PureComponent<Props, State> {
  state = {
    password: '',
    rememberPassword: false,
  };

  componentDidMount() {
    getSavedPassword()
      .then(p => {
        if (p) {
          this.setState({ password: p, rememberPassword: true });
        }
      })
      .catch();
  }
  componentDidUpdate() {
    const { props } = this;

    if (props.walletUnlockSucceded === true) {
      if (this.state.rememberPassword) {
        setSavedPassword(this.state.password);
      }
      props.closeModal();
    }
  }

  onChangePassword(event: SyntheticInputEvent<*>) {
    this.setState({ password: event.target.value });
  }

  onChangeRememberPassword(event: SyntheticInputEvent<>) {
    this.setState({ rememberPassword: event.target.checked });
  }

  render() {
    const { quit, unlockWallet, walletUnlockSucceded } = this.props;

    const { password, rememberPassword } = this.state;
    return (
      <Modal
        isOpen
        title={__('Unlock Wallet')}
        contentLabel={__('Unlock Wallet')}
        type="confirm"
        shouldCloseOnOverlayClick={false}
        confirmButtonLabel={__('Unlock')}
        abortButtonLabel={__('Exit')}
        onConfirmed={() => unlockWallet(password)}
        onAborted={quit}
      >
        <Form onSubmit={() => unlockWallet(password)}>
          <p>
            {__('Your wallet has been encrypted with a local password. Please enter your wallet password to proceed.')}{' '}
            <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
          </p>
          <FormField
            autoFocus
            error={walletUnlockSucceded === false ? 'Incorrect Password' : false}
            label={__('Wallet Password')}
            type="password"
            name="wallet-password"
            onChange={event => this.onChangePassword(event)}
            value={password || ''}
          />
          <fieldset-section>
            <FormField
              label={__('Remember Password')}
              type="checkbox"
              name="wallet-remember-password"
              onChange={event => this.onChangeRememberPassword(event)}
              checked={rememberPassword}
              helper={__('You will no longer see this at startup')}
            />
          </fieldset-section>
        </Form>
      </Modal>
    );
  }
}

export default ModalWalletUnlock;
