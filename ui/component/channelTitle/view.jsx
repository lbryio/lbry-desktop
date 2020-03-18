// @flow
import React from 'react';

type Props = {
  claim: ?ChannelClaim,
  title: ?string,
};

function ChannelTitle(props: Props) {
  const { title, claim } = props;

  if (!claim) {
    return null;
  }

  return <div className="claim-preview__title">{title || claim.name}</div>;
}

export default ChannelTitle;
