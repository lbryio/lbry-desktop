// @flow
import React from 'react';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  uri: string,
  claim: ?Claim,
};

function ClaimEffectiveAmount(props: Props) {
  const { claim } = props;

  if (!claim) {
    return null;
  }

  return <LbcSymbol prefix={claim.meta.effective_amount} />;
}

export default ClaimEffectiveAmount;
