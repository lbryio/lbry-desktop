// @flow
import React from 'react';
import { Form, FormRow, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  quit: () => void,
  unlockWallet: string => void,
  walletUnlockSucceded: boolean,
};

class ModalWalletUnlock extends React.PureComponent<Props> {
  state = {
    password: null,
  };

  componentDidUpdate() {
    const { props } = this;

    if (props.walletUnlockSucceded === true) {
      props.closeModal();
    }
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { quit, unlockWallet, walletUnlockSucceded, closeModal } = this.props;

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
        <section className="card__content">
          <Form onSubmit={() => unlockWallet(password)}>
            <p>
              {__(
                'Your wallet has been encrypted with a local password. Please enter your wallet password to proceed.'
              )}
            </p>
            <FormRow padded>
              <FormField
                stretch
                autoFocus
                error={walletUnlockSucceded === false ? 'Incorrect Password' : false}
                label={__('Wallet Password')}
                type="password"
                name="wallet-password"
                onChange={event => this.onChangePassword(event)}
              />
            </FormRow>
            <div className="card__actions">
              <Button
                button="link"
                label={__('Learn more')}
                href="https://lbry.io/faq/wallet-encryption"
              />
            </div>
          </Form>
        </section>
      </Modal>
    );
  }
}

export default ModalWalletUnlock;
