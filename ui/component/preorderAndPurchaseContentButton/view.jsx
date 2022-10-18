// @flow
import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import './style.scss';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import * as STRIPE from 'constants/stripe';
import Button from 'component/button';
import { secondsToDhms } from 'util/time';

type RentalTagParams = { price: number, expirationTimeInSeconds: number };

type Props = {
  uri: string,
  type?: 'default' | 'overlay',
  // --- redux ---
  claim: StreamClaim,
  claimIsMine: boolean,
  doCheckIfPurchasedClaimId: (string) => void,
  doOpenModal: (string, {}) => void,
  doResolveClaimIds: (Array<string>) => Promise<any>,
  preferredCurrency: string,
  preorderContentClaim: Claim,
  preorderContentClaimId: string,
  preorderTag: number,
  purchaseMadeForClaimId: ?boolean,
  purchaseTag: string,
  rentalTag: RentalTagParams,
  validRentalPurchase: any,
  hasSavedCard: ?boolean,
  canReceiveFiatTips: ?boolean,
  doGetCustomerStatus: () => void,
  doTipAccountCheckForUri: (uri: string) => void,
};

export default function PreorderAndPurchaseButton(props: Props) {
  const {
    type = 'default',
    claim,
    claimIsMine,
    doCheckIfPurchasedClaimId,
    doOpenModal,
    doResolveClaimIds,
    preorderContentClaim, // populates after doResolveClaimIds
    preorderContentClaimId, // full content that will be purchased
    preferredCurrency,
    preorderTag, // the price of the preorder
    purchaseMadeForClaimId,
    purchaseTag, // the price of the purchase
    rentalTag,
    uri,
    validRentalPurchase,
    hasSavedCard,
    canReceiveFiatTips,
    doGetCustomerStatus,
    doTipAccountCheckForUri,
  } = props;

  const [rentExpiresTime, setRentExpiresTime] = React.useState(false);

  const myUpload = claimIsMine;
  const isOverlay = type === 'overlay';

  // setting as 0 so flow doesn't complain, better approach?
  let rentalPrice,
    rentalExpirationTimeInSeconds = 0;
  if (rentalTag) {
    rentalPrice = rentalTag.price;
    rentalExpirationTimeInSeconds = rentalTag.expirationTimeInSeconds;
  }

  React.useEffect(() => {
    if (preorderContentClaimId) {
      doResolveClaimIds([preorderContentClaimId]);
    }
  }, [preorderContentClaimId]);

  React.useEffect(() => {
    if (validRentalPurchase) {
      const differenceInSeconds = moment
        .duration(moment(validRentalPurchase.valid_through).diff(new Date()))
        .asSeconds();
      setRentExpiresTime(secondsToDhms(differenceInSeconds));
    }
  }, [validRentalPurchase]);

  React.useEffect(() => {
    if (preorderTag || purchaseTag || rentalTag) {
      doTipAccountCheckForUri(uri);
    }
  }, [doTipAccountCheckForUri, preorderTag, purchaseTag, rentalTag, uri]);

  // check if user has a payment method saved
  React.useEffect(() => {
    if (hasSavedCard === undefined) doGetCustomerStatus();
  }, [doGetCustomerStatus, hasSavedCard]);

  const { icon: fiatIconToUse, symbol: fiatSymbol } = STRIPE.CURRENCY[preferredCurrency];

  let tags = {
    rentalTag,
    purchaseTag,
    preorderTag,
  };

  const canBePurchased = preorderTag || purchaseTag || rentalTag;

  return (
    <div
      className={classnames('paid-content-prompt', {
        'paid-content-prompt--overlay': isOverlay,
      })}
    >
      {canReceiveFiatTips === false && !myUpload && canBePurchased && (
        <div className="paid-content-prompt__notice">{__('Creator cannot receive payments yet.')}</div>
      )}
      {canReceiveFiatTips === false && myUpload && canBePurchased && !isOverlay && (
        <div className="paid-content-prompt__notice">
          <I18nMessage
            tokens={{
              set_up_your_bank_account: (
                <Button
                  button="link"
                  label={__('Set up your bank account')}
                  navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`} // TODO: use the modal
                />
              ),
            }}
          >
            %set_up_your_bank_account% to receive payments.
          </I18nMessage>
        </div>
      )}
      {canReceiveFiatTips && (
        <>
          {/* viewer can rent or purchase */}
          {rentalTag &&
            isOverlay &&
            purchaseTag &&
            !purchaseMadeForClaimId &&
            !validRentalPurchase &&
            !myUpload &&
            !preorderContentClaim && (
              <>
                <div className="paid-content-prompt__price">
                  <Icon icon={ICONS.BUY} />
                  {__('Purchase for %purchase_currency%%purchase_amount%', {
                    purchase_currency: fiatSymbol,
                    purchase_amount: purchaseTag,
                  })}
                </div>
                <div className="paid-content-prompt__price">
                  <Icon icon={ICONS.TIME} />
                  {__('Rent %rent_duration% for %rent_currency%%rent_amount%', {
                    rent_duration: secondsToDhms(rentalExpirationTimeInSeconds),
                    rent_currency: fiatSymbol,
                    rent_amount: rentalPrice,
                  })}
                </div>
                <Button
                  iconColor="red"
                  className={'preorder-button'}
                  icon={fiatIconToUse}
                  button="primary"
                  label={__('Purchase or Rent')}
                  requiresAuth
                  onClick={() =>
                    doOpenModal(MODALS.PREORDER_AND_PURCHASE_CONTENT, {
                      uri,
                      purchaseTag,
                      doCheckIfPurchasedClaimId,
                      claimId: claim.claim_id,
                      hasSavedCard,
                      tags,
                      humanReadableTime: secondsToDhms(rentalExpirationTimeInSeconds),
                    })
                  }
                />
              </>
            )}
          {/* viewer can rent */}
          {rentalTag && !purchaseTag && !validRentalPurchase && !myUpload && isOverlay && (
            <>
              <div className="paid-content-prompt__price">
                <Icon icon={ICONS.TIME} />
                {__('Rent %rental_duration% for %currency%%amount%', {
                  currency: fiatSymbol,
                  amount: rentalPrice,
                  rental_duration: secondsToDhms(rentalExpirationTimeInSeconds),
                })}
              </div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('Rent')}
                requiresAuth
                onClick={() =>
                  doOpenModal(MODALS.PREORDER_AND_PURCHASE_CONTENT, {
                    uri,
                    purchaseTag,
                    doCheckIfPurchasedClaimId,
                    claimId: claim.claim_id,
                    hasSavedCard,
                    tags,
                    humanReadableTime: secondsToDhms(rentalExpirationTimeInSeconds),
                  })
                }
              />
            </>
          )}
          {/* purchasable content, not preordered and still needs to be purchased */}
          {purchaseTag && !rentalTag && !purchaseMadeForClaimId && !myUpload && !preorderContentClaim && isOverlay && (
            <>
              <div className="paid-content-prompt__price">
                <Icon icon={ICONS.BUY} />
                {__('Purchase for %currency%%amount%', { currency: fiatSymbol, amount: purchaseTag })}
              </div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('Purchase')}
                requiresAuth
                onClick={() =>
                  doOpenModal(MODALS.PREORDER_AND_PURCHASE_CONTENT, {
                    uri,
                    purchaseTag,
                    doCheckIfPurchasedClaimId,
                    claimId: claim.claim_id,
                    hasSavedCard,
                    tags,
                  })
                }
              />
            </>
          )}
          {/* purchasable content, already purchased or preordered */}
          {purchaseTag && !validRentalPurchase && purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
            // Unnecessary to thank the user every render? Maybe change this to just an unlocked icon.
            <div className="paid-content-prompt__notice">{__('Thanks for purchasing, enjoy your content!')}</div>
          )}
          {/* content is available and user has ordered (redirect to content) */}
          {preorderTag && purchaseMadeForClaimId && !myUpload && preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                button="primary"
                label={__('Click here to view your purchased content')}
                navigate={`/${preorderContentClaim.canonical_url.replace('lbry://', '')}`}
              />
            </div>
          )}
          {/* content is available and user hasn't ordered (redirect to content) */}
          {preorderTag && !purchaseMadeForClaimId && !myUpload && preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                button="primary"
                label={__('Click here to view full content ')}
                navigate={`/${preorderContentClaim.canonical_url.replace('lbry://', '')}`}
              />
            </div>
          )}
          {/* viewer can preorder */}
          {preorderTag && !purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('Preorder now for %fiatSymbol%%preorderTag%', {
                  fiatSymbol,
                  preorderTag,
                })}
                requiresAuth
                onClick={() =>
                  doOpenModal(MODALS.PREORDER_AND_PURCHASE_CONTENT, {
                    uri,
                    preorderTag,
                    doCheckIfPurchasedClaimId,
                    claimId: claim.claim_id,
                    hasSavedCard,
                    tags,
                  })
                }
              />
            </div>
          )}
          {/* viewer has preordered */}
          {preorderTag && purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
            <div className="paid-content-prompt__notice">{__('You have preordered this content')}</div>
          )}
          {rentalTag && validRentalPurchase && !myUpload && !preorderContentClaim && (
            <div className="paid-content-prompt__notice">
              {__('Your rental expires in %rentExpiresTime%', { rentExpiresTime })}
            </div>
          )}
          {/* viewer owns this content */}
          {/* @if TARGET='DISABLE_FOR_NOW' */}
          {preorderTag && myUpload && (
            <div className="paid-content-prompt__notice">{__('You cannot preorder your own content')}</div>
          )}
          {purchaseTag && !rentalTag && myUpload && (
            <div className="paid-content-prompt__notice">{__('You cannot purchase your own content')}</div>
          )}
          {rentalTag && !purchaseTag && myUpload && (
            <div className="paid-content-prompt__notice">{__('You cannot rent your own content')}</div>
          )}
          {rentalTag && purchaseTag && myUpload && (
            <div className="paid-content-prompt__notice">{__('You cannot purchase or rent your own content')}</div>
          )}
          {/* @endif */}
        </>
      )}
    </div>
  );
}
