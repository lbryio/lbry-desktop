import * as MODALS from "constants/modal_types";
import React from "react";
import Button from "component/button";
import { Form, FormField } from "component/common/form";
import { Formik } from "formik";
import validateSendTx from "util/form-validation";
import Card from "component/common/card";
import I18nMessage from "component/i18nMessage";
import LbcSymbol from "component/common/lbc-symbol";
import WalletSpendableBalanceHelp from "component/walletSpendableBalanceHelp";
import classnames from "classnames";
import ChannelSelector from "component/channelSelector";
import ClaimPreview from "component/claimPreview";

type Props = {
  openModal: (
    id: string,
    arg2: {
      destination: string;
      amount: string;
      isAddress: boolean;
    }
  ) => void;
  draftTransaction: {
    address: string;
    amount: string;
  };
  setDraftTransaction: (arg1: { address: string; amount: string }) => void;
  balance: number;
  isAddress: boolean;
  setIsAddress: (arg1: boolean) => void;
  contentUri: string;
  contentError: string;
  contentClaim?: StreamClaim;
  setEnteredContentUri: (arg1: string) => void;
  confirmed: boolean;
  setConfirmed: (arg1: boolean) => void;
  sendLabel: string;
  setSendLabel: (arg1: string) => void;
  snack:
    | {
        linkTarget: string | null | undefined;
        linkText: string | null | undefined;
        message: string;
        isError: boolean;
      }
    | null
    | undefined;
};

class WalletSend extends React.PureComponent<Props> {
  constructor() {
    // @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();

    (this as any).handleSubmit = this.handleSubmit.bind(this);
    (this as any).handleClear = this.handleClear.bind(this);
  }

  handleSubmit() {
    const { draftTransaction, openModal, isAddress, contentUri, setConfirmed } = this.props;
    const destination = isAddress ? draftTransaction.address : contentUri;
    const amount = draftTransaction.amount;

    const modalProps = { destination, amount, isAddress, setConfirmed } as const;

    openModal(MODALS.CONFIRM_TRANSACTION, modalProps);
  }

  handleClear() {
    const { setDraftTransaction, setConfirmed } = this.props;
    setDraftTransaction({
      address: "",
      amount: "",
    });
    setConfirmed(false);
  }

  render() {
    const {
      draftTransaction,
      setDraftTransaction,
      balance,
      isAddress,
      setIsAddress,
      contentUri,
      contentClaim,
      setEnteredContentUri,
      contentError,
      confirmed,
      sendLabel,
      setSendLabel,
      snack,
    } = this.props;
    if (confirmed) {
      this.handleClear();
      setSendLabel("Sending...");
    }
    if (snack) setSendLabel("Send");

    return (
      <Card
        title={__("Send Credits")}
        subtitle={
          // @ts-expect-error - TS2745, TS2322 (ts-migration)
          <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
            Send LBRY Credits to your friends or favorite creators.
          </I18nMessage>
        }
        actions={
          <Formik
            initialValues={{
              address: "",
              amount: "",
            }}
            onSubmit={this.handleSubmit}
            render={({ values, errors, touched, handleBlur, handleSubmit }) => (
              <div>
                <div className="section">
                  <Button
                    key="Address"
                    // @ts-expect-error - TS2322 (ts-migration)
                    label={__("Address")}
                    button="alt"
                    onClick={() => setIsAddress(true)}
                    className={classnames("button-toggle", { "button-toggle--active": isAddress })}
                  />
                  <Button
                    key="Search"
                    // @ts-expect-error - TS2322 (ts-migration)
                    label={__("Search")}
                    button="alt"
                    onClick={() => setIsAddress(false)}
                    className={classnames("button-toggle", { "button-toggle--active": !isAddress })}
                  />
                </div>

                <div className="section">
                  {/* @ts-expect-error - TS2739 (ts-migration) */}
                  {!isAddress && <ChannelSelector />}

                  <Form onSubmit={handleSubmit}>
                    {!isAddress && (
                      <FormField
                        type="text"
                        name="search"
                        error={contentError}
                        placeholder={__("Enter a name, @username or URL")}
                        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; error: string; placeholder: string; className: string; label: string; onChange: (event: any) => void; onBlur: any; value: any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                        className="form-field--address"
                        label={__("Recipient search")}
                        onChange={(event) => setEnteredContentUri(event.target.value)}
                        onBlur={handleBlur}
                        // @ts-expect-error - TS2339 (ts-migration)
                        value={values.search}
                      />
                    )}

                    {!isAddress && (
                      // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
                      <fieldset-section>
                        <ClaimPreview
                          key={contentUri}
                          uri={contentUri}
                          actions={""}
                          type={"small"}
                          showNullPlaceholder
                          hideMenu
                          hideRepostLabel
                        />
                        {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
                      </fieldset-section>
                    )}

                    {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                    <fieldset-group class="fieldset-group--smushed">
                      <FormField
                        autoFocus
                        type="number"
                        name="amount"
                        label={__("Amount")}
                        className="form-field--price-amount"
                        affixClass="form-field--fix-no-height"
                        // @ts-expect-error - TS2322 - Type 'string' is not assignable to type 'number'.
                        min="0"
                        step="any"
                        placeholder="12.34"
                        onChange={(event) =>
                          setDraftTransaction({ address: draftTransaction.address, amount: event.target.value })
                        }
                        onBlur={handleBlur}
                        value={draftTransaction.amount}
                      />
                      {isAddress && (
                        <FormField
                          type="text"
                          name="address"
                          placeholder={"bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs"}
                          // @ts-expect-error - TS2322 - Type '{ type: string; name: string; placeholder: string; className: string; label: string; onChange: (event: any) => void; onBlur: any; value: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                          className="form-field--address"
                          label={__("Recipient address")}
                          onChange={(event) =>
                            setDraftTransaction({ address: event.target.value, amount: draftTransaction.amount })
                          }
                          onBlur={handleBlur}
                          value={draftTransaction.address}
                        />
                      )}
                      {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                    </fieldset-group>

                    <div className="card__actions">
                      <Button
                        // @ts-expect-error - TS2322 (ts-migration)
                        button="primary"
                        type="submit"
                        label={__(sendLabel)}
                        disabled={
                          !(parseFloat(draftTransaction.amount) > 0.0) ||
                          parseFloat(draftTransaction.amount) >= balance ||
                          sendLabel === "Sending..." ||
                          (isAddress
                            ? !draftTransaction.address || validateSendTx(draftTransaction.address).address !== ""
                            : !contentClaim)
                        }
                      />
                      {!!Object.keys(errors).length || (
                        <span className="error__text">
                          {/* @ts-expect-error - TS2339 (ts-migration) */}
                          {(!!draftTransaction.address && touched.address && errors.address) ||
                            // @ts-expect-error - TS2339 (ts-migration)
                            (!!draftTransaction.amount && touched.amount && errors.amount) ||
                            (parseFloat(draftTransaction.amount) === balance &&
                              __("Decrease amount to account for transaction fee")) ||
                            (parseFloat(draftTransaction.amount) > balance && __("Not enough Credits"))}
                        </span>
                      )}
                    </div>
                    <WalletSpendableBalanceHelp />
                  </Form>
                </div>
              </div>
            )}
          />
        }
      />
    );
  }
}

export default WalletSend;
