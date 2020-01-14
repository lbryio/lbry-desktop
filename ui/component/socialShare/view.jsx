// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedArea from 'component/embedArea';

type Props = {
  claim: Claim,
  webShareable: boolean,
  isChannel: boolean,
  referralCode: string,
  user: any,
};

class SocialShare extends React.PureComponent<Props> {
  static defaultProps = {
    isChannel: false,
  };

  constructor(props: Props) {
    super(props);

    this.input = undefined;
  }

  input: ?HTMLInputElement;

  render() {
    const { claim, isChannel, referralCode, user } = this.props;
    const { canonical_url: canonicalUrl, permanent_url: permanentUrl } = claim;
    const { webShareable } = this.props;
    const rewardsApproved = user && user.is_reward_approved;
    const OPEN_URL = 'https://open.lbry.com/';
    const lbryUrl = canonicalUrl ? canonicalUrl.split('lbry://')[1] : permanentUrl.split('lbry://')[1];
    const lbryWebUrl = lbryUrl.replace(/#/g, ':');
    const encodedLbryURL: string = `${OPEN_URL}${encodeURIComponent(lbryWebUrl)}`;
    const referralParam: string = referralCode && rewardsApproved ? `?r=${referralCode}` : '';
    const lbryURL: string = `${OPEN_URL}${lbryWebUrl}${referralParam}`;

    const shareOnFb = __('Share on Facebook');
    const shareOnTwitter = __('Share On Twitter');

    return (
      <React.Fragment>
        <CopyableText label={__('LBRY Link')} copyable={lbryURL} noSnackbar />
        <div className="">
          <Button
            icon={ICONS.FACEBOOK}
            button="link"
            description={shareOnFb}
            href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`}
          />{' '}
          <Button
            icon={ICONS.TWITTER}
            button="link"
            description={shareOnTwitter}
            href={`https://twitter.com/intent/tweet?text=${encodedLbryURL}`}
          />
        </div>
        {webShareable && !isChannel && <EmbedArea label={__('Embedded')} claim={claim} noSnackbar />}
      </React.Fragment>
    );
  }
}

export default SocialShare;
