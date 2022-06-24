// @flow
import * as React from 'react';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

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
      let customerTransactionResponse = await getPaymentHistory();

      let matchingTransaction = false;
      for (const transaction of customerTransactionResponse) {
        if (claimId === transaction.source_claim_id) {
          matchingTransaction = true;
        }
      }

      if (matchingTransaction) {
        setHasAlreadyPreordered(true);
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
      {preorderTag && !hasAlreadyPreordered && !myUpload && (<div>
        <Button
          // ref={buttonRef}
          iconColor="red"
          className={'preorder-button'}
          // largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
          icon={fiatIconToUse}
          button="primary"
          label={`Preorder now for ${fiatSymbolToUse}${preorderTag}`}
          // title={titlePrefix}
          requiresAuth
          onClick={() => doOpenModal(MODALS.PREORDER_CONTENT, { uri, checkIfAlreadyPurchased })}
        />
      </div>)}
      {preorderTag && hasAlreadyPreordered && !myUpload && (<div>
        <Button
          // ref={buttonRef}
          iconColor="red"
          className={'preorder-button'}
          // largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
          button="primary"
          label={'You have preordered this content'}
          // title={titlePrefix}
          requiresAuth
        />
      </div>)}
      {preorderTag && myUpload && (<div>
        <Button
          // ref={buttonRef}
          iconColor="red"
          className={'preorder-button'}
          // largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
          button="primary"
          label={'You cannot preorder your own content'}
          // title={titlePrefix}
        />
      </div>)}
    </>
  );
}
