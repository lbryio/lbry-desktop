// @flow
import React from 'react';
import classnames from 'classnames';
import { ComboboxOption } from '@reach/combobox';
import FileThumbnail from 'component/fileThumbnail';
import ChannelThumbnail from 'component/channelThumbnail';
import FileProperties from 'component/previewOverlayProperties';
import ClaimProperties from 'component/claimProperties';
import PremiumBadge from 'component/premiumBadge';

type Props = {
  claim: ?Claim,
  uri: string,
  isResolvingUri: boolean,
  geoRestriction: ?GeoRestriction,
};

export default function WunderbarSuggestion(props: Props) {
  const { claim, uri, isResolvingUri, geoRestriction } = props;

  if (isResolvingUri) {
    return (
      <ComboboxOption value={uri}>
        <div className="wunderbar__suggestion">
          <div className="media__thumb media__thumb--resolving" />
        </div>
      </ComboboxOption>
    );
  }

  if (!claim) {
    return null;
  }

  if (geoRestriction) {
    // Could display something else in the future, but hide completely for now.
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
        {isChannel && <ChannelThumbnail small uri={uri} />}
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
            <PremiumBadge uri={uri} />
          </div>
        </span>
      </div>
    </ComboboxOption>
  );
}
