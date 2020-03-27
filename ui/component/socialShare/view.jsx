// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedTextArea from 'component/embedTextArea';
import { generateDirectUrl } from 'util/lbrytv';

const IOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

type Props = {
  claim: Claim,
  webShareable: boolean,
  referralCode: string,
  user: any,
};

type State = {
  showEmbed: boolean,
  showExtra: boolean,
};

class SocialShare extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showEmbed: false,
      showExtra: false,
    };
    this.input = undefined;
  }

  input: ?HTMLInputElement;

  render() {
    const { claim, referralCode, user, webShareable } = this.props;
    const { showEmbed, showExtra } = this.state;

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
    const lbryURL: string = `${OPEN_URL}${lbryWebUrl}${referralParam}`;
    const directUrl = generateDirectUrl(name, claimId);

    return (
      <React.Fragment>
        <CopyableText label={__('LBRY Link')} copyable={lbryURL} />
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
                onClick={() => this.setState({ showEmbed: !showEmbed })}
              />
              <Button
                className="share"
                iconSize={24}
                icon={ICONS.MORE}
                title={__('More actions')}
                onClick={() => this.setState({ showExtra: !showExtra })}
              />
            </React.Fragment>
          )}
        </div>
        {showEmbed && <EmbedTextArea label={__('Embedded')} claim={claim} />}
        {showExtra && (
          <div className="section">
            <CopyableText label={__('Direct Link')} copyable={directUrl} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default SocialShare;
