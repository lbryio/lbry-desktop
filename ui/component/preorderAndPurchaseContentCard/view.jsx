// @flow
import { Form } from 'component/common/form';
import * as STRIPE from 'constants/stripe';
import Button from 'component/button';
import Card from 'component/common/card';
import React from 'react';

import withCreditCard from 'hocs/withCreditCard';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

// prettier-ignore
const STRINGS = {
  purchase: {
    title: 'Purchase Your Content',
    subtitle: "After completing the purchase you will have instant access to your content that doesn't expire.",
    button: 'Purchase your content for %currency%%amount%',
    add_card: '%add_a_card% to purchase content',
  },
  preorder: {
    title: 'Pre-order Your Content',
    subtitle: 'This content is not available yet but you can pre-order it now so you can access it as soon as it goes live.',
    button: 'Pre-order your content for %currency%%amount%',
    add_card: '%add_a_card% to preorder content',
  },
  rental: {
    title: 'Rent Your Content',
    subtitle: 'You can rent this content and it will be available for %humanReadableTime%',
    button: 'Rent your content for %currency%%amount%',
    add_card: '%add_a_card% to preorder content',
  },
  purchaseOrRent: {
    title: 'Purchase Or Rent Your Content',
    subtitle: 'You can purchase this content for access that doesn\'t ' +
      'expire for %currency%%purchasePrice%, or rent for %humanReadableTime% for %currency%%rentPrice%.',
    button: 'Purchase your content for %currency%%amount%',
    add_card: '%add_a_card% to purchase or rent your content',
  },
};

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
  // preferredCurrency: string,
  preOrderPurchase: (
    TipParams,
    anonymous: boolean,
    UserParams,
    claimId: string,
    stripe: ?string,
    preferredCurrency: string,
    type: string,
    expiredTime: ?string,
    ?(any) => Promise<void>,
    ?(any) => void
  ) => void,
  purchaseMadeForClaimId: ?boolean,
  doCheckIfPurchasedClaimId: (string) => void,
  preferredCurrency: string,
  tags: any,
  humanReadableTime: ?string,
};

export default function PreorderAndPurchaseContentCard(props: Props) {
  const {
    activeChannelId,
    activeChannelName,
    channelClaimId,
    tipChannelName,
    doHideModal,
    preOrderPurchase,
    preferredCurrency,
    doCheckIfPurchasedClaimId,
    claimId,
    tags,
    humanReadableTime,
  } = props;

  const [tipAmount, setTipAmount] = React.useState(0);
  const [rentTipAmount, setRentTipAmount] = React.useState(0);
  const [waitingForBackend, setWaitingForBackend] = React.useState(false);

  // set the purchase amount once the preorder tag is selected
  React.useEffect(() => {
    if (tags.purchaseTag && tags.rentalTag) {
      setTipAmount(tags.purchaseTag);
      setRentTipAmount(tags.rentalTag.price);
    } else if (tags.purchaseTag) {
      setTipAmount(tags.purchaseTag);
    } else if (tags.rentalTag) {
      setTipAmount(tags.rentalTag.price);
    } else if (tags.preorderTag) {
      setTipAmount(tags.preorderTag);
    }
  }, [tags]);

  let transactionType;
  if (tags.purchaseTag && tags.rentalTag) {
    transactionType = 'purchaseOrRent';
  } else if (tags.purchaseTag) {
    transactionType = 'purchase';
  } else if (tags.rentalTag) {
    transactionType = 'rental';
  } else {
    transactionType = 'preorder';
  }

  const STR = STRINGS[transactionType];
  const RENT_STRINGS = STRINGS['rental'];

  const fiatSymbol = STRIPE.CURRENCY[preferredCurrency].symbol;

  function handleSubmit(forceRental) {
    // if it's both purchase/rent, use purchase, for rent we will force it
    if (transactionType === 'purchaseOrRent') {
      transactionType = 'purchase';
    }
    if (forceRental) transactionType = 'rental';

    const itsARental = transactionType === 'rental';

    const tipParams: TipParams = {
      tipAmount: itsARental ? tags.rentalTag.price : tipAmount,
      tipChannelName: tipChannelName || '',
      channelClaimId: channelClaimId || '',
    };
    const userParams: UserParams = { activeChannelName, activeChannelId };

    async function checkIfFinished() {
      await doCheckIfPurchasedClaimId(claimId);
      doHideModal();
    }

    setWaitingForBackend(true);

    let expirationTime = itsARental ? tags.rentalTag.expirationTimeInSeconds : undefined;

    // hit backend to send tip
    preOrderPurchase(
      tipParams,
      !activeChannelId,
      userParams,
      claimId,
      stripeEnvironment,
      preferredCurrency,
      transactionType,
      expirationTime,
      checkIfFinished,
      doHideModal
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      {!waitingForBackend && (
        <Card
          title={__(STR.title)}
          className={'preorder-content-modal'}
          subtitle={
            <div className="section__subtitle">
              {__(STR.subtitle, {
                humanReadableTime,
                currency: fiatSymbol,
                purchasePrice: tipAmount.toString(),
                rentPrice: tags.rentalTag?.price,
              })}
            </div>
          }
          actions={
            <SubmitArea
              handleSubmit={handleSubmit}
              STR={STR}
              fiatSymbol={fiatSymbol}
              tipAmount={tipAmount}
              tags={tags}
              RENT_STRINGS={RENT_STRINGS}
              rentTipAmount={rentTipAmount}
            />
          }
        />
      )}
      {/* processing payment card */}
      {waitingForBackend && (
        <Card
          title={__(STR.title)}
          className={'preorder-content-modal-loading'}
          subtitle={<div className="section__subtitle">{__('Processing your purchase...')}</div>}
        />
      )}
    </Form>
  );
}

const SubmitButton = (props: any) => <Button autoFocus button="primary" {...props} />;

const SubmitArea = withCreditCard((props: any) => (
  <>
    <div className="handle-submit-area">
      <SubmitButton
        onClick={() => props.handleSubmit()}
        label={__(props.STR.button, { currency: props.fiatSymbol, amount: props.tipAmount.toString() })}
      />
      {props.tags.purchaseTag && props.tags.rentalTag && (
        <SubmitButton
          onClick={() => props.handleSubmit('rent')}
          label={__(props.RENT_STRINGS.button, { currency: props.fiatSymbol, amount: props.rentTipAmount.toString() })}
        />
      )}
    </div>
  </>
));
