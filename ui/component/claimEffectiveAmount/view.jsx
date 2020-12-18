// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: ?Claim,
};

function ClaimEffectiveAmount(props: Props) {
  const { claim } = props;

  if (!claim) {
    return null;
  }

  return <CreditAmount amount={Number(claim.repost_bid_amount || claim.meta.effective_amount || claim.amount)} />;
}

export default ClaimEffectiveAmount;
