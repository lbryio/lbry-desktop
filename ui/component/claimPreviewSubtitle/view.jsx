// @flow
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import React from 'react';
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';
import LivestreamDateTime from 'component/livestreamDateTime';
import Button from 'component/button';
import FileViewCountInline from 'component/fileViewCountInline';
import { getChannelSubCountStr, getChannelViewCountStr } from 'util/formatMediaDuration';
import { toCompactNotation } from 'util/string';
import { parseURI } from 'util/lbryURI';

const SPACED_BULLET = '\u00A0\u2022\u00A0';

type Props = {
  uri: string,
  type?: string,
  showAtSign?: boolean,
  // --- redux ---
  claim: ?StreamClaim,
  pending?: boolean,
  beginPublish: (?string) => void,
  isLivestream: boolean,
  lang: string,
  fetchSubCount: (string) => void,
  subCount: ?number,
  showMemberBadge?: boolean,
};

// previews used in channel overview and homepage (and other places?)
function ClaimPreviewSubtitle(props: Props) {
  const {
    pending,
    uri,
    claim,
    type,
    beginPublish,
    isLivestream,
    fetchSubCount,
    subCount,
    showAtSign,
    lang,
    showMemberBadge,
  } = props;
  const isChannel = claim && claim.value_type === 'channel';
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;

  const claimId = (claim && claim.claim_id) || '0';
  const formattedSubCount = subCount ? toCompactNotation(subCount, lang, 10000) : null;

  React.useEffect(() => {
    if (isChannel) {
      fetchSubCount(claimId);
    }
  }, [isChannel, fetchSubCount, claimId]);

  let name;
  try {
    ({ streamName: name } = parseURI(uri));
  } catch (e) {}

  return (
    <div className="media__subtitle">
      {claim ? (
        <React.Fragment>
          <UriIndicator uri={uri} showAtSign={showAtSign} showMemberBadge={showMemberBadge} link />{' '}
          {!pending && claim && (
            <>
              {isChannel && type !== 'inline' && (
                <>
                  <span className="claim-preview-metadata-sub-upload">
                    {getChannelViewCountStr(claimsInChannel)}
                    {Number.isInteger(subCount) ? SPACED_BULLET : ''}
                    {getChannelSubCountStr(subCount, formattedSubCount)}
                  </span>
                </>
              )}

              {!isChannel &&
                (isLivestream && ENABLE_NO_SOURCE_CLAIMS ? (
                  <LivestreamDateTime uri={uri} />
                ) : (
                  <span className="claim-extra-info">
                    <FileViewCountInline uri={uri} isLivestream={isLivestream} />
                    <DateTime timeAgo uri={uri} />
                  </span>
                ))}
            </>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div>{__('Upload something and claim this spot!')}</div>
          <div className="card__actions">
            <Button onClick={() => beginPublish(name)} button="primary" label={__('Publish to %uri%', { uri })} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ClaimPreviewSubtitle;
