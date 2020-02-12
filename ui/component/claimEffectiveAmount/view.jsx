// @flow
import React from 'react';

type Props = {
  uri: string,
  claim: ?Claim,
};

function ClaimRepostAuthor(props: Props) {
  const { claim } = props;

  if (!claim) {
    return null;
  }

  return <span>{claim.meta.effective_amount}</span>;
}

export default ClaimRepostAuthor;
