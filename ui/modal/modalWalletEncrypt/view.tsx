import React from "react";
import { Form, FormField, Submit } from "component/common/form";
import { Modal } from "modal/modal";
import Button from "component/button";
import { setSavedPassword } from "util/saved-passwords";

type Props = {
  closeModal: () => void;
  walletEncryptSucceded: boolean;
  // @ts-expect-error - TS2300 - Duplicate identifier 'updateWalletStatus'.
  updateWalletStatus: boolean;
  encryptWallet: (arg1?: string | null | undefined) => void;
  // @ts-expect-error - TS2300 - Duplicate identifier 'updateWalletStatus'. | TS2717 - Subsequent property declarations must have the same type.  Property 'updateWalletStatus' must be of type 'boolean', but here has type '() => void'.
  updateWalletStatus: () => void;
};

type State = {
  newPassword: string | null | undefined;
  newPasswordConfirm: string | null | undefined;
  passwordMismatch: boolean;
  understandConfirmed: boolean;
  understandError: boolean;
  submitted: boolean;
  failMessage: string | null | undefined;
  rememberPassword: boolean;
};

const acknowledgementText = __("I Understand");

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
        // @ts-expect-error - TS2349 - This expression is not callable.
        props.updateWalletStatus();
      } else if (props.walletEncryptSucceded === false) {
        // See https://github.com/lbryio/lbry/issues/1307
        this.setState({ failMessage: "Unable to encrypt wallet." });
      }
    }
  }

  onChangeNewPassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newPassword: event.target.value });
  }

  onChangeRememberPassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ rememberPassword: event.target.checked });
  }

  onChangeNewPasswordConfirm(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newPasswordConfirm: event.target.value });
  }

  onChangeUnderstandConfirm(event: React.ChangeEvent<HTMLInputElement>) {
    const regex = new RegExp("^.?" + acknowledgementText + ".?$", "i");
    this.setState({
      understandConfirmed: regex.test(event.target.value),
    });
  }

  submitEncryptForm() {
    const { state } = this;

    if (!state.newPassword) {
      return;
    }

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

    setSavedPassword(state.newPassword, state.rememberPassword);
    this.setState({ submitted: true });
    this.props.encryptWallet(state.newPassword);
  }

  render() {
    const { closeModal } = this.props;

    const { passwordMismatch, understandError, failMessage } = this.state;
    return (
      <Modal
        // @ts-expect-error - TS2322 - Type '{ children: Element[]; isOpen: true; title: string; contentLabel: string; type: string; onConfirmed: () => void; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
        isOpen
        title={__("Encrypt wallet")}
        contentLabel={__("Encrypt wallet")}
        type="custom"
        onConfirmed={() => this.submitEncryptForm()}
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.submitEncryptForm()}>
          <p>
            {__(
              "Encrypting your wallet will require a password to access your local wallet data when LBRY starts. Please enter a new password for your wallet."
            )}{" "}
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="link" label={__("Learn more")} href="https://lbry.com/faq/wallet-encryption" />.
          </p>
          {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          <fieldset-section>
            <FormField
              autoFocus
              error={passwordMismatch === true ? "Passwords do not match" : false}
              label={__("Password")}
              placeholder={__("Shh...")}
              type="password"
              name="wallet-new-password"
              onChange={(event) => this.onChangeNewPassword(event)}
            />
            {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          </fieldset-section>
          {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          <fieldset-section>
            <FormField
              error={passwordMismatch === true ? "Passwords do not match" : false}
              label={__("Confirm Password")}
              placeholder={__("Your eyes only")}
              type="password"
              name="wallet-new-password-confirm"
              onChange={(event) => this.onChangeNewPasswordConfirm(event)}
            />
            {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          </fieldset-section>
          {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          <fieldset-section>
            <FormField
              label={__("Remember Password")}
              type="checkbox"
              name="wallet-remember-password"
              onChange={(event) => this.onChangeRememberPassword(event)}
              // @ts-expect-error - TS2322 - Type '{ label: string; type: string; name: string; onChange: (event: any) => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={this.state.rememberPassword}
            />
            {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          </fieldset-section>

          <div className="help--warning">
            {__(
              "If your password is lost, it cannot be recovered. You will not be able to access your wallet without a password."
            )}
          </div>
          <FormField
            // @ts-expect-error - TS2769 - No overload matches this call.
            inputButton={<Submit label={failMessage ? __("Encrypting Wallet") : __("Encrypt wallet")} />}
            error={
              understandError === true
                ? __('You must enter "%acknowledgement_text%"', { acknowledgement_text: acknowledgementText })
                : false
            }
            label={__('Enter "%acknowledgement_text%"', { acknowledgement_text: acknowledgementText })}
            placeholder={__('Type "%acknowledgement_text%"', { acknowledgement_text: acknowledgementText })}
            type="text"
            name="wallet-understand"
            onChange={(event) => this.onChangeUnderstandConfirm(event)}
          />
          {failMessage && <div className="error__text">{__(failMessage)}</div>}
        </Form>
        <div className="card__actions">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" label={__("Cancel")} onClick={closeModal} />
        </div>
      </Modal>
    );
  }
}

export default ModalWalletEncrypt;
