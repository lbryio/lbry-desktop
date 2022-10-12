// @flow
import React from 'react';

import * as STRIPE from 'constants/stripe';

type Props = {
  amount: number,
  currency: string,
  doCustomerPurchaseCost: (cost: number) => Promise<StripeCustomerPurchaseCostResponse>,
};

function FeeBreakdown(props: Props) {
  const { amount, currency, doCustomerPurchaseCost } = props;

  const [fees, setFees] = React.useState();

  function getAmountStr(amount: number) {
    return amount ? amount.toFixed(2) : '---';
  }

  React.useEffect(() => {
    doCustomerPurchaseCost(amount)
      .then((x) => setFees(x))
      .catch((e) => {
        setFees(null);
        console.error('customer/purchase_cost: ' + e); // eslint-disable-line no-console
      });
  }, [amount, doCustomerPurchaseCost]);

  if (amount === 0 || !fees) {
    return null;
  }

  return (
    <>
      {__('Payment processing fee: %currency%%ppf% • Odysee platform fee: %currency%%opf%', {
        ppf: getAmountStr(fees?.stripe_cut),
        opf: getAmountStr(fees?.odysee_cut),
        currency: STRIPE.CURRENCY[currency].symbol,
      })}
    </>
  );
}

export default FeeBreakdown;
