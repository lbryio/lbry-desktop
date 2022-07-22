// @flow
import React from 'react';

type Props = {
  claim: ?ChannelClaim,
  title: ?string,
  isComment?: Boolean,
  fallback?: any,
};

function ChannelTitle(props: Props) {
  const { title, claim, isComment, fallback } = props;

  if (isComment) {
    if (!title) return fallback && fallback[0] && fallback[0].substring(0, fallback[0].indexOf(':'));
    else return title;
  }

  if (!claim) {
    return null;
  }

  return <div className="claim-preview__title">{title || claim.name}</div>;
}

export default ChannelTitle;
