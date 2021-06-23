// @flow
import React from 'react';
import classnames from 'classnames';
import { ComboboxOption } from '@reach/combobox';
import FileThumbnail from 'component/fileThumbnail';
import ChannelThumbnail from 'component/channelThumbnail';
import FileProperties from 'component/previewOverlayProperties';
import ClaimProperties from 'component/claimProperties';

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
  const isCollection = claim.value_type === 'collection';

  return (
    <ComboboxOption value={uri}>
      <div
        className={classnames('wunderbar__suggestion', {
          'wunderbar__suggestion--channel': isChannel,
        })}
      >
        {isChannel && <ChannelThumbnail uri={uri} />}
        {!isChannel && (
          <FileThumbnail uri={uri}>
            {/* @if TARGET='app' */}
            {!isCollection && (
              <div className="claim-preview__file-property-overlay">
                <FileProperties uri={uri} small iconOnly />
              </div>
            )}
            {/* @endif */}
            {isCollection && (
              <div className="claim-preview__claim-property-overlay">
                <ClaimProperties uri={uri} small iconOnly />
              </div>
            )}
          </FileThumbnail>
        )}
        <span className="wunderbar__suggestion-label">
          <div className="wunderbar__suggestion-title">{claim.value.title}</div>
          <div className="wunderbar__suggestion-name">
            {isChannel ? claim.name : (claim.signing_channel && claim.signing_channel.name) || __('Anonymous')}
          </div>
        </span>
      </div>
    </ComboboxOption>
  );
}
