// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: ?Claim,
};

function ClaimEffectiveAmount(props: Props) {
  const { claim } = props;
  const notWinning = Boolean(claim && claim.meta && !claim.meta.is_controlling);

  if (!claim) {
    return null;
  }

  return <CreditAmount notWinning={notWinning} amount={Number(claim.meta.effective_amount)} />;
}

export default ClaimEffectiveAmount;
