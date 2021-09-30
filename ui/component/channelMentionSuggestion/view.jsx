// @flow
import { ComboboxOption } from '@reach/combobox';
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';

type Props = {
  claim: ?Claim,
  uri?: string,
  isResolvingUri: boolean,
};

export default function ChannelMentionSuggestion(props: Props) {
  const { claim, uri, isResolvingUri } = props;

  return !claim ? null : (
    <ComboboxOption value={uri}>
      {isResolvingUri ? (
        <div className="channel-mention__suggestion">
          <div className="media__thumb media__thumb--resolving" />
        </div>
      ) : (
        <div className="channel-mention__suggestion">
          <ChannelThumbnail xsmall uri={uri} />
          <span className="channel-mention__suggestion-label">
            <div className="channel-mention__suggestion-name">{claim.name}</div>
            <div className="channel-mention__suggestion-title">{(claim.value && claim.value.title) || claim.name}</div>
          </span>
        </div>
      )}
    </ComboboxOption>
  );
}
