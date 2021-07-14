// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?Claim,
  hideAnonymous: boolean,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: (string) => void,
  uri: string,
  // to allow for other elements to be nested within the UriIndicator
  children: ?Node,
  inline: boolean,
  external?: boolean,
  className?: string,
};

class UriIndicator extends React.PureComponent<Props> {
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
    const {
      link,
      isResolvingUri,
      claim,
      children,
      inline,
      hideAnonymous = false,
      external = false,
      className,
      ...props
    } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    const isChannelClaim = claim.value_type === 'channel';

    if (!claim.signing_channel && !isChannelClaim) {
      if (hideAnonymous) {
        return null;
      }

      return (
        <span dir="auto" className={classnames('channel-name', className, { 'channel-name--inline': inline })}>
          Anonymous
        </span>
      );
    }

    const channelClaim = isChannelClaim ? claim : claim.signing_channel;

    if (channelClaim) {
      const { name } = channelClaim;
      const channelLink = link ? channelClaim.canonical_url || channelClaim.permanent_url : false;

      const inner = (
        <span dir="auto" className={classnames('channel-name', { 'channel-name--inline': inline })}>
          {name}
        </span>
      );

      if (!channelLink) {
        return inner;
      }

      if (children) {
        return (
          <Button className={className} target={external ? '_blank' : undefined} navigate={channelLink} {...props}>
            {children}
          </Button>
        );
      } else {
        return (
          <Button
            className={classnames(className, 'button--uri-indicator')}
            navigate={channelLink}
            target={external ? '_blank' : undefined}
            {...props}
          >
            {inner}
          </Button>
        );
      }
    } else {
      return null;
    }
  }
}

export default UriIndicator;
