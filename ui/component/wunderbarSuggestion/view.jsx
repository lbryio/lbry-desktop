// @flow
import React from 'react';
import classnames from 'classnames';
import { ComboboxOption } from '@reach/combobox';
import FileThumbnail from 'component/fileThumbnail';
import ChannelThumbnail from 'component/channelThumbnail';

type Props = {
  claim: ?Claim,
  uri: string,
};

export default function WunderbarSuggestion(props: Props) {
  const { claim, uri } = props;

  if (!claim) {
    return null;
  }

  const isChannel = claim.value_type === 'channel';

  return (
    <ComboboxOption value={uri}>
      <div
        className={classnames('wunderbar__suggestion', {
          'wunderbar__suggestion--channel': isChannel,
        })}
      >
        {isChannel ? <ChannelThumbnail uri={uri} /> : <FileThumbnail uri={uri} />}
        <span className="wunderbar__suggestion-label">
          <div>{claim.value.title}</div>
          <div className="wunderbar__suggestion-name">
            {isChannel ? claim.name : (claim.signing_channel && claim.signing_channel.name) || __('Anonymous')}
          </div>
        </span>
      </div>
    </ComboboxOption>
  );
}
