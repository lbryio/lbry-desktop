// @flow
import * as React from 'react';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import * as STRIPE from 'constants/stripe';
import Button from 'component/button';
import { secondsToDhms } from 'util/time';
const moment = require('moment');

type RentalTagParams = { price: number, expirationTimeInSeconds: number };

type Props = {
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
  uri: string,
  validRentalPurchase: any,
  hasSavedCard: ?boolean,
  canReceiveFiatTips: ?boolean,
  doGetCustomerStatus: () => void,
  doTipAccountCheckForUri: (uri: string) => void,
};

export default function PreorderAndPurchaseButton(props: Props) {
  const {
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
    <>
      {canReceiveFiatTips === false && !myUpload && canBePurchased && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button non-clickable'}
            button="primary"
            label={__('Creator cannot receive payments yet')}
            style={{ opacity: 0.6 }}
          />
        </div>
      )}
      {canReceiveFiatTips === false && myUpload && canBePurchased && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            button="primary"
            label={__('Setup your account to receive payments')}
            navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
          />
        </div>
      )}
      {canReceiveFiatTips && (
        <>
          {/* viewer can rent or purchase */}
          {rentalTag &&
            purchaseTag &&
            !purchaseMadeForClaimId &&
            !validRentalPurchase &&
            !myUpload &&
            !preorderContentClaim && (
              <div>
                <Button
                  iconColor="red"
                  className={'preorder-button'}
                  icon={fiatIconToUse}
                  button="primary"
                  label={__('Purchase for %fiatSymbol%%purchasePrice% or Rent for %fiatSymbol%%rentalPrice%', {
                    fiatSymbol,
                    rentalPrice,
                    purchasePrice: purchaseTag,
                  })}
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
              </div>
            )}
          {/* viewer can rent */}
          {rentalTag && !purchaseTag && !validRentalPurchase && !myUpload && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('Rent for %humanReadableTime% for %fiatSymbol%%rentalPrice% ', {
                  fiatSymbol,
                  rentalPrice,
                  humanReadableTime: secondsToDhms(rentalExpirationTimeInSeconds),
                })}
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
            </div>
          )}
          {/* purchasable content, not preordered and still needs to be purchased */}
          {purchaseTag && !rentalTag && !purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('This content can be purchased for %fiatSymbol%%purchaseTag%', {
                  fiatSymbol,
                  purchaseTag,
                })}
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
            </div>
          )}
          {/* purchasable content, already purchased or preordered */}
          {purchaseTag && !validRentalPurchase && purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button'}
                icon={fiatIconToUse}
                button="primary"
                label={__('Thanks for purchasing, enjoy your content!')}
                requiresAuth
              />
            </div>
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
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('You have preordered this content')}
                requiresAuth
              />
            </div>
          )}
          {rentalTag && validRentalPurchase && !myUpload && !preorderContentClaim && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('Your rental expires in %rentExpiresTime%', { rentExpiresTime })}
                requiresAuth
              />
            </div>
          )}
          {/* viewer owns this content */}
          {preorderTag && myUpload && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('You cannot preorder your own content')}
              />
            </div>
          )}
          {purchaseTag && !rentalTag && myUpload && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('You cannot purchase your own content')}
              />
            </div>
          )}
          {rentalTag && !purchaseTag && myUpload && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('You cannot rent your own content')}
              />
            </div>
          )}
          {rentalTag && purchaseTag && myUpload && (
            <div>
              <Button
                iconColor="red"
                className={'preorder-button non-clickable'}
                button="primary"
                label={__('You cannot purchase or rent your own content')}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
