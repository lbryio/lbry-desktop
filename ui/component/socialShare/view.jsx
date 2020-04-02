// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedTextArea from 'component/embedTextArea';
import { generateDownloadUrl } from 'util/lbrytv';
import useIsMobile from 'effects/use-is-mobile';

const IOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const SUPPORTS_SHARE_API = typeof navigator.share !== 'undefined';

type Props = {
  claim: StreamClaim,
  title: ?string,
  webShareable: boolean,
  referralCode: string,
  user: any,
};

function SocialShare(props: Props) {
  const { claim, title, referralCode, user, webShareable } = props;
  const [showEmbed, setShowEmbed] = React.useState(false);
  const [showExtra, setShowExtra] = React.useState(false);
  const isMobile = useIsMobile();

  if (!claim) {
    return null;
  }

  const { canonical_url: canonicalUrl, permanent_url: permanentUrl, name, claim_id: claimId } = claim;
  const isChannel = claim.value_type === 'channel';
  const rewardsApproved = user && user.is_reward_approved;
  const OPEN_URL = 'https://open.lbry.com/';
  const lbryUrl = canonicalUrl ? canonicalUrl.split('lbry://')[1] : permanentUrl.split('lbry://')[1];
  const lbryWebUrl = lbryUrl.replace(/#/g, ':');
  const encodedLbryURL: string = `${OPEN_URL}${encodeURIComponent(lbryWebUrl)}`;
  const referralParam: string = referralCode && rewardsApproved ? `?r=${referralCode}` : '';
  const openDotLbryDotComUrl: string = `${OPEN_URL}${lbryWebUrl}${referralParam}`;
  const downloadUrl = `${generateDownloadUrl(name, claimId)}`;

  function handleWebShareClick() {
    if (navigator.share) {
      navigator.share({
        title: title || claim.name,
        url: window.location.href,
      });
    }
  }

  return (
    <React.Fragment>
      <CopyableText label={__('LBRY Link')} copyable={openDotLbryDotComUrl} />
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
      {showEmbed && <EmbedTextArea label={__('Embedded')} claim={claim} />}
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
