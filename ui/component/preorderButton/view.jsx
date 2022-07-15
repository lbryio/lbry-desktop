// @flow
import * as React from 'react';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

type Props = {
  preorderTag: string,
  doOpenModal: (string, {}) => void,
  claim: StreamClaim,
  uri: string,
  claimIsMine: boolean,
  preferredCurrency: string,
};

export default function PreorderButton(props: Props) {
  const { preorderTag, doOpenModal, uri, claim, claimIsMine, preferredCurrency } = props;

  const claimId = claim.claim_id;
  const myUpload = claimIsMine;

  const [hasAlreadyPreordered, setHasAlreadyPreordered] = React.useState(false);

  function getPaymentHistory() {
    return Lbryio.call(
      'customer',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  async function checkIfAlreadyPurchased() {
    try {
      // get card payments customer has made
      const customerTransactionResponse = await getPaymentHistory();

      // if they have a transaction for this claim already, assume it's a preorder
      // note: this *could* be spoofed, because it doesn't check versus the amount,
      // but should be OK for now
      if (customerTransactionResponse?.length) {
        for (const transaction of customerTransactionResponse) {
          if (claimId === transaction.source_claim_id) {
            setHasAlreadyPreordered(true);
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  let fiatIconToUse = ICONS.FINANCE;
  let fiatSymbolToUse = '$';
  if (preferredCurrency === 'EUR') {
    fiatIconToUse = ICONS.EURO;
    fiatSymbolToUse = '€';
  }

  // populate customer payment data
  React.useEffect(() => {
    checkIfAlreadyPurchased();
  }, []);

  return (
    <>
      {preorderTag && !hasAlreadyPreordered && !myUpload && (
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
            onClick={() => doOpenModal(MODALS.PREORDER_CONTENT, { uri, checkIfAlreadyPurchased })}
          />
        </div>
      )}
      {preorderTag && hasAlreadyPreordered && !myUpload && (
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
    </>
  );
}
