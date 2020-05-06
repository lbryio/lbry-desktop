// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedTextArea from 'component/embedTextArea';
import { generateDownloadUrl } from 'util/lbrytv';
import useIsMobile from 'effects/use-is-mobile';
import { FormField } from 'component/common/form';
import { hmsToSeconds, secondsToHms } from 'util/time';
import { generateLbryUrl, generateLbryWebUrl, generateEncodedLbryURL, generateOpenDotLbryDotComUrl } from 'util/url';

const IOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const SUPPORTS_SHARE_API = typeof navigator.share !== 'undefined';

type Props = {
  claim: StreamClaim,
  title: ?string,
  webShareable: boolean,
  referralCode: string,
  user: any,
  position: number,
};

function SocialShare(props: Props) {
  const { claim, title, referralCode, user, webShareable, position } = props;
  const [showEmbed, setShowEmbed] = React.useState(false);
  const [showExtra, setShowExtra] = React.useState(false);
  const [includeStartTime, setincludeStartTime]: [boolean, any] = React.useState(false);
  const [startTime, setStartTime]: [string, any] = React.useState(secondsToHms(position));
  const [startTimeSeconds, setStartTimeSeconds]: [number, any] = React.useState(Math.floor(position));
  const isMobile = useIsMobile();

  let canonicalUrl = 'lbry://';
  let permanentUrl = 'lbry://';
  let name = '';
  let claimId = '';

  if (claim) {
    canonicalUrl = claim.canonical_url;
    permanentUrl = claim.permanent_url;
    name = claim.name;
    claimId = claim.claim_id;
  }

  const isChannel = claim.value_type === 'channel';
  const rewardsApproved = user && user.is_reward_approved;
  const OPEN_URL = 'https://open.lbry.com/';
  const lbryUrl: string = generateLbryUrl(canonicalUrl, permanentUrl);
  const lbryWebUrl: string = generateLbryWebUrl(lbryUrl);
  const [encodedLbryURL, setEncodedLbryURL]: [string, any] = React.useState(
    generateEncodedLbryURL(OPEN_URL, lbryWebUrl, includeStartTime, startTime)
  );
  const [openDotLbryDotComUrl, setOpenDotLbryDotComUrl]: [string, any] = React.useState(
    generateOpenDotLbryDotComUrl(
      OPEN_URL,
      lbryWebUrl,
      canonicalUrl,
      permanentUrl,
      referralCode,
      rewardsApproved,
      includeStartTime,
      startTime
    )
  );
  const downloadUrl = `${generateDownloadUrl(name, claimId)}`;

  if (!claim) {
    return null;
  }

  function handleWebShareClick() {
    if (navigator.share) {
      navigator.share({
        title: title || claim.name,
        url: window.location.href,
      });
    }
  }

  function handleTimeCheckboxChange(checked) {
    setincludeStartTime(checked);
    updateUrls(checked, startTimeSeconds);
  }

  function handleTimeChange(value) {
    setStartTime(value);
    const startSeconds = hmsToSeconds(value);
    setStartTimeSeconds(startSeconds);
    updateUrls(true, startSeconds);
  }

  function updateUrls(includeStartTime, startTime) {
    setOpenDotLbryDotComUrl(
      generateOpenDotLbryDotComUrl(
        OPEN_URL,
        lbryWebUrl,
        canonicalUrl,
        permanentUrl,
        referralCode,
        rewardsApproved,
        includeStartTime,
        startTime
      )
    );

    setEncodedLbryURL(generateEncodedLbryURL(OPEN_URL, lbryWebUrl, includeStartTime, startTime));
  }

  return (
    <React.Fragment>
      <CopyableText label={__('LBRY Link')} copyable={openDotLbryDotComUrl} />
      <div className="section__start-at">
        <FormField
          type="checkbox"
          name="share_start_at_checkbox"
          onChange={() => handleTimeCheckboxChange(!includeStartTime)}
          checked={includeStartTime}
          label={__('Start at')}
        />
        <FormField
          type="text"
          name="share_start_at"
          value={startTime}
          disabled={!includeStartTime}
          onChange={event => handleTimeChange(event.target.value)}
        />
      </div>
      <div className="section__actions">
        <Button
          className="share"
          iconSize={24}
          icon={ICONS.TWITTER}
          href={`https://twitter.com/intent/tweet?text=${encodedLbryURL}`}
        />
        <Button
          className="share"
          iconSize={24}
          icon={ICONS.REDDIT}
          title={__('Share on Facebook')}
          href={`https://reddit.com/submit?url=${encodedLbryURL}`}
        />
        {IOS && (
          // Only ios client supports share urls
          <Button
            className="share"
            iconSize={24}
            icon={ICONS.TELEGRAM}
            title={__('Share on Telegram')}
            href={`tg://msg_url?url=${encodedLbryURL}&amp;text=text`}
          />
        )}
        <Button
          className="share"
          iconSize={24}
          icon={ICONS.LINKEDIN}
          title={__('Share on LinkedIn')}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedLbryURL}`}
        />
        <Button
          className="share"
          iconSize={24}
          icon={ICONS.FACEBOOK}
          title={__('Share on Facebook')}
          href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`}
        />
        {webShareable && !isChannel && (
          <React.Fragment>
            <Button
              className="share"
              iconSize={24}
              icon={ICONS.EMBED}
              title={__('Embed this content')}
              onClick={() => {
                setShowEmbed(!showEmbed);
                setShowExtra(false);
              }}
            />
            <Button
              className="share"
              iconSize={24}
              icon={ICONS.MORE}
              title={__('More actions')}
              onClick={() => {
                setShowExtra(!showExtra);
                setShowEmbed(false);
              }}
            />
          </React.Fragment>
        )}
      </div>

      {SUPPORTS_SHARE_API && isMobile && (
        <div className="section__actions">
          <Button icon={ICONS.SHARE} button="primary" label={__('Share via...')} onClick={handleWebShareClick} />
        </div>
      )}
      {showEmbed && (
        <EmbedTextArea
          label={__('Embedded')}
          claim={claim}
          includeStartTime={includeStartTime}
          startTime={startTimeSeconds}
        />
      )}
      {showExtra && (
        <div className="section">
          <CopyableText label={__('LBRY URL')} copyable={`lbry://${lbryUrl}`} />
          <CopyableText label={__('Download Link')} copyable={downloadUrl} />
        </div>
      )}
    </React.Fragment>
  );
}

export default SocialShare;
