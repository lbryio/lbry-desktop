// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedArea from 'component/embedArea';

type Props = {
  claim: Claim,
  onDone: () => void,
  webShareable: boolean,
  isChannel: boolean,
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
    const { claim } = this.props;
    const { canonical_url: canonicalUrl, permanent_url: permanentUrl } = claim;
    const { webShareable, onDone } = this.props;
    const OPEN_URL = 'https://open.lbry.com/';
    const lbryUrl = canonicalUrl ? canonicalUrl.split('lbry://')[1] : permanentUrl.split('lbry://')[1];
    const lbryWebUrl = lbryUrl.replace(/#/g, ':');
    const encodedLbryURL: string = `${OPEN_URL}${encodeURIComponent(lbryWebUrl)}`;
    const lbryURL: string = `${OPEN_URL}${lbryWebUrl}`;

    const shareOnFb = __('Share on Facebook');
    const shareOnTwitter = __('Share On Twitter');

    return (
      <React.Fragment>
        <CopyableText label={__('LBRY App Link')} copyable={lbryURL} noSnackbar />
        <div className="card__actions card__actions--center">
          <Button
            icon={ICONS.FACEBOOK}
            button="link"
            description={shareOnFb}
            href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`}
          />
          <Button
            icon={ICONS.TWITTER}
            button="link"
            description={shareOnTwitter}
            href={`https://twitter.com/intent/tweet?text=${encodedLbryURL}`}
          />
        </div>
        {webShareable && <EmbedArea label={__('Embedded')} claim={claim} noSnackbar />}
        {!webShareable && <p className={'help'}>{__('Paid content cannot be embedded')}</p>}
        <div className="card__actions">
          <Button button="link" label={__('Done')} onClick={onDone} />
        </div>
      </React.Fragment>
    );
  }
}

export default SocialShare;
