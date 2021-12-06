// @flow
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';

type Props = {
  claim?: Claim,
  uri?: string,
};

export default function TextareaSuggestionsItem(props: Props) {
  const { claim, uri, ...autocompleteProps } = props;

  if (!claim) return null;

  const value = claim.canonical_url.replace('lbry://', '').replace('#', ':');

  return (
    <div {...autocompleteProps}>
      <ChannelThumbnail xsmall uri={uri} />

      <div className="textareaSuggestion__label">
        <span className="textareaSuggestion__title">{(claim.value && claim.value.title) || value}</span>
        <span className="textareaSuggestion__value">{value}</span>
      </div>
    </div>
  );
}
