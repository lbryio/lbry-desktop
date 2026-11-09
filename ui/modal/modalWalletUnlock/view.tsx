import React from 'react';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { getSavedPassword, setSavedPassword } from 'util/saved-passwords';

type Props = {
  quit: () => void,
  closeModal: () => void,
  unlockWallet: (arg1?: string | null | undefined) => void,
  walletUnlockSucceded: boolean,
  shouldTryWithBlankPassword: boolean
};

type State = {
  password: string,
  rememberPassword: boolean
};

class ModalWalletUnlock extends React.PureComponent<Props, State> {
  state = {
    password: '',
    rememberPassword: false,
  };

  componentDidMount() {
    const { unlockWallet, shouldTryWithBlankPassword } = this.props;

    getSavedPassword().then(p => {
      if (p !== null) {
        this.setState({ password: p, rememberPassword: true });
        unlockWallet(p);
      } else if (shouldTryWithBlankPassword) {
        unlockWallet('');
      }
    });
  }
  componentDidUpdate() {
    const { props } = this;

    if (props.walletUnlockSucceded === true) {
      setSavedPassword(this.state.password, this.state.rememberPassword);
      props.closeModal();
    }
  }

  onChangePassword(event: React.ChangeEvent<any>) {
    this.setState({ password: event.target.value });
  }

  onChangeRememberPassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ rememberPassword: event.target.checked });
  }

  render() {
    const { quit, unlockWallet, walletUnlockSucceded } = this.props;

    const { password, rememberPassword } = this.state;
    return (
      <Modal
// @ts-expect-error - TS2322 - Type '{ children: Element[]; isOpen: true; title: string; contentLabel: string; type: string; shouldCloseOnOverlayClick: boolean; confirmButtonLabel: string; abortButtonLabel: string; onConfirmed: () => void; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
        isOpen
        title={__('Unlock wallet')}
        contentLabel={__('Unlock wallet')}
        type="confirm"
        shouldCloseOnOverlayClick={false}
        confirmButtonLabel={__('Unlock')}
        abortButtonLabel={__('Exit')}
        onConfirmed={() => unlockWallet(password)}
        onAborted={quit}
      >
        <p>
          {__('Your wallet has been encrypted with a local password. Please enter your wallet password to proceed.')}{' '}
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
        </p>
{ /* @ts-expect-error - TS2769 - No overload matches this call. */}
        <Form className="section" onSubmit={() => unlockWallet(password)}>
          <FormField
            autoFocus
            error={walletUnlockSucceded === false ? 'Incorrect Password' : false}
            label={__('Wallet Password')}
            type="password"
            name="wallet-password"
            onChange={event => this.onChangePassword(event)}
            value={password || ''}
          />
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          <fieldset-section>
            <FormField
              label={__('Remember Password')}
              type="checkbox"
              name="wallet-remember-password"
              onChange={event => this.onChangeRememberPassword(event)}
// @ts-expect-error - TS2322 - Type '{ label: string; type: string; name: string; onChange: (event: any) => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={rememberPassword}
            />
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          </fieldset-section>
        </Form>
      </Modal>
    );
  }
}

export default ModalWalletUnlock;
