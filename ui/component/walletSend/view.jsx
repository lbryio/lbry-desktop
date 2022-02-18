// @flow
import * as MODALS from 'constants/modal_types';
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { Formik } from 'formik';
import validateSendTx from 'util/form-validation';
import Card from 'component/common/card';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';
import classnames from 'classnames';
import ChannelSelector from 'component/channelSelector';
import ClaimPreview from 'component/claimPreview';

type Props = {
  openModal: (id: string, { destination: string, amount: string, isAddress: boolean }) => void,
  draftTransaction: { address: string, amount: string },
  setDraftTransaction: ({ address: string, amount: string }) => void,
  balance: number,
  isAddress: boolean,
  setIsAddress: (boolean) => void,
  contentUri: string,
  contentError: string,
  contentClaim?: StreamClaim,
  setEnteredContentUri: (string) => void,
  confirmed: boolean,
  setConfirmed: (boolean) => void,
  sendLabel: string,
  setSendLabel: (string) => void,
  snack: ?{
    linkTarget: ?string,
    linkText: ?string,
    message: string,
    isError: boolean,
  },
};

class WalletSend extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleClear = this.handleClear.bind(this);
  }

  handleSubmit() {
    const { draftTransaction, openModal, isAddress, contentUri, setConfirmed } = this.props;
    const destination = isAddress ? draftTransaction.address : contentUri;
    const amount = draftTransaction.amount;

    const modalProps = { destination, amount, isAddress, setConfirmed };

    openModal(MODALS.CONFIRM_TRANSACTION, modalProps);
  }

  handleClear() {
    const { setDraftTransaction, setConfirmed } = this.props;
    setDraftTransaction({
      address: '',
      amount: '',
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
      setSendLabel('Sending...');
    }
    if (snack) setSendLabel('Send');

    return (
      <Card
        title={__('Send Credits')}
        subtitle={__('Send Credits to your friends or favorite creators.')}
        actions={
          <Formik
            initialValues={{
              address: '',
              amount: '',
            }}
            onSubmit={this.handleSubmit}
            render={({ values, errors, touched, handleBlur, handleSubmit }) => (
              <div>
                <div className="section">
                  <Button
                    key="Address"
                    label={__('Address')}
                    button="alt"
                    onClick={() => setIsAddress(true)}
                    className={classnames('button-toggle', { 'button-toggle--active': isAddress })}
                  />
                  <Button
                    key="Search"
                    label={__('Search')}
                    button="alt"
                    onClick={() => setIsAddress(false)}
                    className={classnames('button-toggle', { 'button-toggle--active': !isAddress })}
                  />
                </div>

                <div className="section">
                  {!isAddress && <ChannelSelector />}

                  <Form onSubmit={handleSubmit}>
                    {!isAddress && (
                      <FormField
                        type="text"
                        name="search"
                        error={contentError}
                        placeholder={__('Enter a name, @username or URL')}
                        className="form-field--address"
                        label={__('Recipient search')}
                        onChange={(event) => setEnteredContentUri(event.target.value)}
                        onBlur={handleBlur}
                        value={values.search}
                      />
                    )}

                    {!isAddress && (
                      <fieldset-section>
                        <ClaimPreview
                          key={contentUri}
                          uri={contentUri}
                          actions={''}
                          type={'small'}
                          showNullPlaceholder
                          hideMenu
                          hideRepostLabel
                        />
                      </fieldset-section>
                    )}

                    <fieldset-group class="fieldset-group--smushed">
                      <FormField
                        autoFocus
                        type="number"
                        name="amount"
                        label={__('Amount')}
                        className="form-field--price-amount"
                        affixClass="form-field--fix-no-height"
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
                          placeholder={'bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs'}
                          className="form-field--address"
                          label={__('Recipient address')}
                          onChange={(event) =>
                            setDraftTransaction({ address: event.target.value, amount: draftTransaction.amount })
                          }
                          onBlur={handleBlur}
                          value={draftTransaction.address}
                        />
                      )}
                    </fieldset-group>

                    <div className="card__actions">
                      <Button
                        button="primary"
                        type="submit"
                        label={__(sendLabel)}
                        disabled={
                          !(parseFloat(draftTransaction.amount) > 0.0) ||
                          parseFloat(draftTransaction.amount) >= balance ||
                          sendLabel === 'Sending...' ||
                          (isAddress
                            ? !draftTransaction.address || validateSendTx(draftTransaction.address).address !== ''
                            : !contentClaim)
                        }
                      />
                      {!!Object.keys(errors).length || (
                        <span className="error__text">
                          {(!!draftTransaction.address && touched.address && errors.address) ||
                            (!!draftTransaction.amount && touched.amount && errors.amount) ||
                            (parseFloat(draftTransaction.amount) === balance &&
                              __('Decrease amount to account for transaction fee')) ||
                            (parseFloat(draftTransaction.amount) > balance && __('Not enough Credits'))}
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
