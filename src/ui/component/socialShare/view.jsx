// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';

type Props = {
  claim: Claim,
  onDone: () => void,
  speechShareable: boolean,
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
    const { short_url: shortUrl } = claim;
    const { speechShareable, onDone } = this.props;

    const lbryTvPrefix = 'https://beta.lbry.tv/';
    const lbryPrefix = 'https://open.lbry.com/';
    const lbryUri = shortUrl.split('lbry://')[1];
    const lbryTvUri = lbryUri.replace('#', '/');
    const encodedLbryURL: string = `${lbryPrefix}${encodeURIComponent(lbryUri)}`;
    const lbryURL: string = `${lbryPrefix}${lbryUri}`;
    const encodedLbryTvUrl = `${lbryTvPrefix}${encodeURIComponent(lbryTvUri)}`;
    const lbryTvUrl = `${lbryTvPrefix}${lbryTvUri}`;

    const shareOnFb = __('Share on Facebook');
    const shareOnTwitter = __('Share On Twitter');

    return (
      <React.Fragment>
        {speechShareable && (
          <div>
            <CopyableText label={__('Web link')} copyable={lbryTvUrl} />
            <div className="card__actions card__actions--center">
              <Button
                icon={ICONS.FACEBOOK}
                button="link"
                description={shareOnFb}
                href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryTvUrl}`}
              />
              <Button
                icon={ICONS.TWITTER}
                button="link"
                description={shareOnTwitter}
                href={`https://twitter.com/intent/tweet?text=${encodedLbryTvUrl}`}
              />
              <Button icon={ICONS.WEB} button="link" description={__('View on lbry.tv')} href={`${lbryTvUrl}`} />
            </div>
          </div>
        )}

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
        <div className="card__actions">
          <Button button="link" label={__('Done')} onClick={onDone} />
        </div>
      </React.Fragment>
    );
  }
}

export default SocialShare;
