import React from "react";

type Props = {
  claim: ChannelClaim | null | undefined;
  title: string | null | undefined;
};

function ChannelTitle(props: Props) {
  const { title, claim } = props;

  if (!claim) {
    return null;
  }

  return <div className="claim-preview__title">{title || claim.name}</div>;
}

export default ChannelTitle;
