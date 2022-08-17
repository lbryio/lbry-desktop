// @flow
import * as React from 'react';

type RentalTagParams = { price: number, expirationTimeInSeconds: number };

type Props = {
  preorderTag: string,
  purchaseTag: string,
  rentalTag: RentalTagParams,
  preorderContentClaimId: string,
  preferredCurrency: string,
};

export default function PreviewTilePurchaseOverlay(props: Props) {
  const { preorderTag, purchaseTag, rentalTag, preorderContentClaimId, preferredCurrency } = props;

  let actionTag;
  let price;
  if (purchaseTag) {
    actionTag = 'Purchase';
    price = purchaseTag;
  } else if (preorderTag) {
    actionTag = 'Preorder';
    price = preorderTag;
  } else if (rentalTag) {
    actionTag = 'Rent';
    price = rentalTag.price;
  }

  const tagToUse =
    purchaseTag ||
    (preorderTag && !preorderContentClaimId) || // preorder but doesn't have a linked claim
    rentalTag;

  const fiatSymbol = preferredCurrency === 'EUR' ? '€' : '$';

  return (
    <>
      {tagToUse && (
        <>
          <div className="claim-preview__file-purchase-overlay">
            <div className="claim-preview__overlay-properties">
              <span>
                {actionTag} for {fiatSymbol}
                {price}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
