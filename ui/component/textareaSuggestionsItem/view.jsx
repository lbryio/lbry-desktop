// @flow
import { ComboboxOption, ComboboxOptionText } from '@reach/combobox';
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';

type Props = {
  claim?: Claim,
  isResolvingUri: boolean,
  uri?: string,
};

export default function TextareaSuggestionsItem(props: Props) {
  const { claim, isResolvingUri, uri } = props;

  if (!claim) return null;

  if (isResolvingUri) {
    return (
      <div className="textareaSuggestion">
        <div className="media__thumb media__thumb--resolving" />
      </div>
    );
  }

  const canonicalMention = claim.canonical_url.replace('lbry://', '').replace('#', ':');

  return (
    <ComboboxOption value={canonicalMention}>
      <div className="textareaSuggestion">
        <ChannelThumbnail xsmall uri={uri} />

        <div className="textareaSuggestion__label">
          <span className="textareaSuggestion__title">
            {(claim.value && claim.value.title) || <ComboboxOptionText />}
          </span>
          <span className="textareaSuggestion__value">
            <ComboboxOptionText />
          </span>
        </div>
      </div>
    </ComboboxOption>
  );
}
