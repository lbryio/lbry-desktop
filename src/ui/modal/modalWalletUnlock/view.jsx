// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  quit: () => void,
  closeModal: () => void,
  unlockWallet: (?string) => void,
  walletUnlockSucceded: boolean,
};

type State = {
  password: string,
};

class ModalWalletUnlock extends React.PureComponent<Props, State> {
  state = {
    password: '',
  };

  componentDidUpdate() {
    const { props } = this;

    if (props.walletUnlockSucceded === true) {
      props.closeModal();
    }
  }

  onChangePassword(event: SyntheticInputEvent<*>) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { quit, unlockWallet, walletUnlockSucceded } = this.props;

    const { password } = this.state;

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
          />
        </Form>
      </Modal>
    );
  }
}

export default ModalWalletUnlock;
