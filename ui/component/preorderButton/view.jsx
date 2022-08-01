// @flow
import * as React from 'react';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  preorderTag: number,
  doOpenModal: (string, {}) => void,
  claim: StreamClaim,
  uri: string,
  claimIsMine: boolean,
  preferredCurrency: string,
  preorderContentClaimId: string,
  doResolveClaimIds: (Array<string>) => Promise<any>,
  preorderContentClaim: Claim,
  purchaseTag: string,
  purchaseMadeForClaimId: ?boolean,
  doCheckIfPurchasedClaimId: (string) => void,
};

export default function PreorderButton(props: Props) {
  const {
    doOpenModal,
    uri,
    claim,
    claimIsMine,
    preferredCurrency,
    doResolveClaimIds,
    doCheckIfPurchasedClaimId,
    preorderContentClaim, // populates after doResolveClaimIds
    preorderContentClaimId, // full content that will be purchased
    preorderTag, // the price of the preorder
    purchaseTag, // the price of the purchase
    purchaseMadeForClaimId,
  } = props;

  const myUpload = claimIsMine;

  React.useEffect(() => {
    if (preorderContentClaimId) {
      doResolveClaimIds([preorderContentClaimId]);
    }
  }, [preorderContentClaimId]);

  let fiatIconToUse = ICONS.FINANCE;
  let fiatSymbolToUse = '$';
  if (preferredCurrency === 'EUR') {
    fiatIconToUse = ICONS.EURO;
    fiatSymbolToUse = '€';
  }

  let preorderOrPurchase;
  let pastTense;
  if (purchaseTag) {
    preorderOrPurchase = 'purchase';
    pastTense = 'purchasing';
  } else {
    preorderOrPurchase = 'preorder';
    pastTense = 'preordering';
  }

  return (
    <>
      {/* purchasable content, not preordered and still needs to be purchased */}
      {purchaseTag && !purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            icon={fiatIconToUse}
            button="primary"
            label={__('This content can be purchased for $' + purchaseTag, {
              fiatSymbolToUse,
              preorderTag,
            })}
            requiresAuth
            onClick={() =>
              doOpenModal(MODALS.PREORDER_CONTENT, {
                uri,
                preorderOrPurchase,
                purchaseTag,
                doCheckIfPurchasedClaimId,
                claimId: claim.claim_id,
              })
            }
          />
        </div>
      )}
      {/* purchasable content, already purchased or preordered */}
      {purchaseTag && purchaseMadeForClaimId && !myUpload && !preorderContentClaim && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            icon={fiatIconToUse}
            button="primary"
            label={__(`Thanks for ${pastTense}, enjoy your content!`, {
              fiatSymbolToUse,
              preorderTag,
            })}
            requiresAuth
          />
        </div>
      )}
      {/* content is available and user has ordered (redirect to content) */}
      {preorderTag && !purchaseMadeForClaimId && !myUpload && preorderContentClaim && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            button="primary"
            label={__('This content is now available, click here to view it')}
            navigate={`/${preorderContentClaim.canonical_url.replace('lbry://', '')}`}
          />
        </div>
      )}
      {/* content is available and user hasn't ordered (redirect to content) */}
      {preorderTag && purchaseMadeForClaimId && !myUpload && preorderContentClaim && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            button="primary"
            label={__('Your preordered content is now available, click here to view it')}
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
            label={__('Preorder now for %fiatSymbolToUse%%preorderTag%', {
              fiatSymbolToUse,
              preorderTag,
            })}
            requiresAuth
            onClick={() =>
              doOpenModal(MODALS.PREORDER_CONTENT, {
                uri,
                preorderOrPurchase,
                preorderTag,
                doCheckIfPurchasedClaimId,
                claimId: claim.claim_id,
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
            className={'preorder-button'}
            button="primary"
            label={__('You have preordered this content')}
            requiresAuth
          />
        </div>
      )}
      {/* viewer owns this content */}
      {preorderTag && myUpload && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            button="primary"
            label={__('You cannot preorder your own content')}
          />
        </div>
      )}
      {purchaseTag && myUpload && (
        <div>
          <Button
            iconColor="red"
            className={'preorder-button'}
            button="primary"
            label={__('You cannot purchase your own content')}
          />
        </div>
      )}
    </>
  );
}
