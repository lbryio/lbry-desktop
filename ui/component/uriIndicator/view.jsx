// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';
import ClaimPreview from 'component/claimPreview';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?Claim,
  addTooltip: boolean,
  hideAnonymous: boolean,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: string => void,
  uri: string,
  // to allow for other elements to be nested within the UriIndicator
  children: ?Node,
  inline: boolean,
};

class UriIndicator extends React.PureComponent<Props> {
  static defaultProps = {
    addTooltip: true,
  };

  componentDidMount() {
    this.resolve(this.props);
  }

  componentDidUpdate() {
    this.resolve(this.props);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { link, isResolvingUri, claim, addTooltip, children, inline, hideAnonymous = false } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    const isChannelClaim = claim.value_type === 'channel';

    if (!claim.signing_channel && !isChannelClaim) {
      if (hideAnonymous) {
        return null;
      }

      return <span className={classnames('channel-name', { 'channel-name--inline': inline })}>Anonymous</span>;
    }

    const channelClaim = isChannelClaim ? claim : claim.signing_channel;

    if (channelClaim) {
      const { name } = channelClaim;
      const channelLink = link ? channelClaim.canonical_url || channelClaim.permanent_url : false;

      const inner = <span className={classnames('channel-name', { 'channel-name--inline': inline })}>{name}</span>;

      if (!channelLink) {
        return inner;
      }

      if (children) {
        return <Button navigate={channelLink}>{children}</Button>;
      } else {
        const Wrapper = addTooltip
          ? ({ children }) => (
              <Tooltip label={<ClaimPreview uri={channelLink} type="tooltip" placeholder={false} />}>
                {children}
              </Tooltip>
            )
          : 'span';
        return (
          <Button className="button--uri-indicator" navigate={channelLink}>
            <Wrapper>{inner}</Wrapper>
          </Button>
        );
      }
    } else {
      return null;
    }
  }
}

export default UriIndicator;
