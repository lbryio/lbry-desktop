// @flow
import React from 'react';

import './style.scss';
import ClaimPreview from 'component/claimPreview';
import BusyIndicator from 'component/common/busy-indicator';
import { Form } from 'component/common/form';
import * as ICONS from 'constants/icons';
import * as STRIPE from 'constants/stripe';
import Button from 'component/button';
import Card from 'component/common/card';
import withCreditCard from 'hocs/withCreditCard';
import { getStripeEnvironment } from 'util/stripe';
import { secondsToDhms } from 'util/time';

const stripeEnvironment = getStripeEnvironment();

type RentalTagParams = { price: number, expirationTimeInSeconds: number };

// prettier-ignore
const STRINGS = {
  purchase: {
    title: 'Confirm Purchase',
    button: 'Purchase for %currency%%amount%',
  },
  preorder: {
    title: 'Confirm Pre-order',
    // subtitle: 'This content is not available yet but you can pre-order it now so you can access it as soon as it goes live.',
    button: 'Pre-order for %currency%%amount%',
  },
  rental: {
    title: 'Confirm Rental',
    button: 'Rent %rental_duration% for %currency%%amount%',
  },
  purchaseOrRent: {
    title: 'Confirm Purchase/Rental',
    button: 'Purchase for %currency%%amount%',
  },
};

type TipParams = { tipAmount: number, tipChannelName: string, channelClaimId: string };
type UserParams = { activeChannelName: ?string, activeChannelId: ?string };

type Props = {
  uri: string,
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
    expiredTime: ?number,
    ?(any) => Promise<void>,
    ?(any) => void
  ) => void,
  purchaseMadeForClaimId: ?boolean,
  doCheckIfPurchasedClaimId: (string) => void,
  preferredCurrency: string,
  preorderTag: number,
  purchaseTag: ?number,
  rentalTag: RentalTagParams,
};

export default function PreorderAndPurchaseContentCard(props: Props) {
  const {
    uri,
    activeChannelId,
    activeChannelName,
    channelClaimId,
    tipChannelName,
    doHideModal,
    preOrderPurchase,
    preferredCurrency,
    doCheckIfPurchasedClaimId,
    claimId,
    rentalTag,
    purchaseTag,
    preorderTag,
  } = props;

  const [waitingForBackend, setWaitingForBackend] = React.useState(false);
  const tags = { rentalTag, purchaseTag, preorderTag };

  let tipAmount = 0;
  let rentTipAmount = 0;

  if (tags.purchaseTag && tags.rentalTag) {
    tipAmount = tags.purchaseTag;
    rentTipAmount = tags.rentalTag.price;
  } else if (tags.purchaseTag) {
    tipAmount = tags.purchaseTag;
  } else if (tags.rentalTag) {
    tipAmount = tags.rentalTag.price;
  } else if (tags.preorderTag) {
    tipAmount = tags.preorderTag;
  }

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

  const rentDuration = tags?.rentalTag?.expirationTimeInSeconds
    ? secondsToDhms(tags.rentalTag.expirationTimeInSeconds)
    : '';

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
      <Card
        title={__(STRINGS[transactionType].title)}
        className={'fiat-order'}
        actions={
          <>
            <div className="fiat-order__actions">
              <div className="fiat-order__claim-preview">
                <ClaimPreview uri={uri} hideMenu hideActions nonClickable type="small" />
              </div>
              {waitingForBackend ? (
                <BusyIndicator message={__('Processing order...')} />
              ) : (
                <SubmitArea
                  handleSubmit={handleSubmit}
                  label={STRINGS[transactionType].button}
                  fiatSymbol={fiatSymbol}
                  tipAmount={tipAmount}
                  tags={tags}
                  rentLabel={STRINGS['rental'].button}
                  rentTipAmount={rentTipAmount}
                  rentDuration={rentDuration}
                />
              )}
            </div>
          </>
        }
      />
    </Form>
  );
}

const SubmitButton = (props: any) => <Button button="primary" {...props} />;

const SubmitArea = withCreditCard((props: any) => (
  <>
    <div className="handle-submit-area">
      <SubmitButton
        onClick={() => props.handleSubmit()}
        label={__(props.label, {
          currency: props.fiatSymbol,
          amount: props.tipAmount.toString(),
          rental_duration: props.rentDuration,
        })}
        icon={props.tags.rentalTag ? ICONS.BUY : ICONS.TIME}
      />
      {props.tags.purchaseTag && props.tags.rentalTag && (
        <SubmitButton
          onClick={() => props.handleSubmit('rent')}
          label={__(props.rentLabel, {
            currency: props.fiatSymbol,
            amount: props.rentTipAmount.toString(),
            rental_duration: props.rentDuration,
          })}
          icon={ICONS.TIME}
        />
      )}
    </div>
  </>
));
