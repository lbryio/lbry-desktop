// @flow
import { Form } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Card from 'component/common/card';
import React from 'react';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

type TipParams = { tipAmount: number, tipChannelName: string, channelClaimId: string };
type UserParams = { activeChannelName: ?string, activeChannelId: ?string };

type Props = {
  activeChannelId?: string,
  activeChannelName?: string,
  claimId: string,
  claimType?: string,
  channelClaimId?: string,
  tipChannelName?: string,
  claimIsMine: boolean,
  isSupport: boolean,
  isTipOnly?: boolean,
  customText?: string,
  doHideModal: () => void,
  setAmount?: (number) => void,
  preferredCurrency: string,
  preOrderPurchase: (
    TipParams,
    anonymous: boolean,
    UserParams,
    claimId: string,
    stripe: ?string,
    preferredCurrency: string,
    type: string,
    ?(any) => Promise<void>,
    ?(any) => void
  ) => void,
  preorderTag: number,
  preorderOrPurchase: string,
  purchaseTag: number,
  purchaseMadeForClaimId: ?boolean,
  doCheckIfPurchasedClaimId: (string) => void,
};

export default function PreorderContent(props: Props) {
  const {
    activeChannelId,
    activeChannelName,
    channelClaimId,
    tipChannelName,
    doHideModal,
    preOrderPurchase,
    preferredCurrency,
    preorderTag,
    preorderOrPurchase,
    purchaseTag,
    doCheckIfPurchasedClaimId,
    claimId,
  } = props;

  function capitalizeFirstLetter(string) {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  }

  let transactionName;
  if (preorderOrPurchase === 'preorder') {
    transactionName = 'pre-order';
  } else {
    transactionName = 'purchase';
  }

  // set the purchase amount once the preorder tag is selected
  React.useEffect(() => {
    if (preorderOrPurchase === 'preorder') {
      setTipAmount(preorderTag);
    } else {
      setTipAmount(purchaseTag);
    }
  }, [preorderTag, purchaseTag]);

  const [tipAmount, setTipAmount] = React.useState(0);
  const [waitingForBackend, setWaitingForBackend] = React.useState(false);
  const [hasCardSaved, setHasSavedCard] = React.useState(false);

  // check if user has a payment method saved
  React.useEffect(() => {
    if (!stripeEnvironment) return;

    Lbryio.call(
      'customer',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    ).then((customerStatusResponse) => {
      const defaultPaymentMethodId =
        customerStatusResponse.Customer &&
        customerStatusResponse.Customer.invoice_settings &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method.id;

      setHasSavedCard(Boolean(defaultPaymentMethodId));
    });
  }, [setHasSavedCard]);

  const modalHeaderText = preorderOrPurchase
    ? __(`%purchase_or_preorder% Your Content`, { purchase_or_preorder: capitalizeFirstLetter(preorderOrPurchase) })
    : '';
  let subtitleString;
  if (preorderOrPurchase === 'purchase') {
    subtitleString = "After completing the purchase you will have instant access to your content that doesn't expire";
  } else {
    subtitleString =
      'This content is not available yet but you can pre-order it now so you can access it as soon as it goes live';
  }

  const subtitleText = __(subtitleString);

  function handleSubmit() {
    const tipParams: TipParams = {
      tipAmount,
      tipChannelName: tipChannelName || '',
      channelClaimId: channelClaimId || '',
    };
    const userParams: UserParams = { activeChannelName, activeChannelId };

    async function checkIfFinished() {
      await doCheckIfPurchasedClaimId(claimId);
      doHideModal();
    }

    setWaitingForBackend(true);

    // hit backend to send tip
    preOrderPurchase(
      tipParams,
      !activeChannelId,
      userParams,
      claimId,
      stripeEnvironment,
      preferredCurrency,
      preorderOrPurchase,
      checkIfFinished,
      doHideModal
    );
  }

  const fiatSymbolToUse = preferredCurrency === 'EUR' ? '€' : '$';

  function buildButtonText() {
    return transactionName
      ? __('%transaction_name% your content for %tip_currency%%tip_amount%', {
          transaction_name: capitalizeFirstLetter(transactionName),
          tip_currency: fiatSymbolToUse,
          tip_amount: tipAmount.toString(),
        })
      : '';
  }

  return (
    <Form onSubmit={handleSubmit}>
      {!waitingForBackend && (
        <Card
          title={modalHeaderText}
          className={'preorder-content-modal'}
          subtitle={<div className="section__subtitle">{subtitleText}</div>}
          actions={
            // confirm purchase functionality
            <>
              <div className="handle-submit-area">
                <Button
                  autoFocus
                  onClick={handleSubmit}
                  button="primary"
                  label={buildButtonText()}
                  disabled={!hasCardSaved}
                />

                {!hasCardSaved && (
                  <div className="add-card-prompt">
                    <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add a Card')} button="link" />
                    {preorderOrPurchase
                      ? ' ' +
                        __(`To %purchase_or_preorder% Content`, {
                          purchase_or_preorder: capitalizeFirstLetter(preorderOrPurchase),
                        })
                      : ''}
                  </div>
                )}
              </div>
            </>
          }
        />
      )}
      {/* processing payment card */}
      {waitingForBackend && (
        <Card
          title={modalHeaderText}
          className={'preorder-content-modal-loading'}
          subtitle={<div className="section__subtitle">{__('Processing your purchase...')}</div>}
        />
      )}
    </Form>
  );
}
