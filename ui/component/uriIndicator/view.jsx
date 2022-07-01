// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import PremiumBadge from 'component/premiumBadge';
import { stripLeadingAtSign } from 'util/string';

type ChannelInfo = { uri: string, name: string, title: string };

type Props = {
  uri: string,
  channelInfo: ?ChannelInfo, // Direct channel info to use, bypassing the need to resolve 'uri'.
  link: ?boolean,
  external?: boolean,
  focusable?: boolean, // Defaults to 'true' if not provided.
  hideAnonymous?: boolean,
  inline?: boolean,
  showAtSign?: boolean,
  className?: string,
  showMemberBadge?: boolean,
  children: ?Node, // to allow for other elements to be nested within the UriIndicator (commit: 1e82586f).
  // --- redux ---
  claim: ?Claim,
  isResolvingUri: boolean,
  comment?: boolean,
  resolveUri: (string) => void,
};

class UriIndicator extends React.PureComponent<Props> {
  componentDidMount() {
    this.resolveClaim(this.props);
  }

  componentDidUpdate() {
    this.resolveClaim(this.props);
  }

  resolveClaim = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri, channelInfo } = props;

    if (!channelInfo && !isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  resolveState = (channelInfo: ?ChannelInfo, claim: ?Claim, isLinkType: ?boolean) => {
    if (channelInfo) {
      return {
        hasChannelData: true,
        isAnonymous: false,
        channelName: channelInfo.name,
        channelLink: isLinkType ? channelInfo.uri : false,
        channelTitle: channelInfo.title,
      };
    } else if (claim) {
      const signingChannel = claim.signing_channel && claim.signing_channel.amount;
      const isChannelClaim = claim.value_type === 'channel';
      const channelClaim = isChannelClaim ? claim : claim.signing_channel;

      return {
        hasChannelData: Boolean(channelClaim),
        isAnonymous: !signingChannel && !isChannelClaim,
        channelName: channelClaim?.name,
        channelLink: isLinkType ? channelClaim?.canonical_url || channelClaim?.permanent_url : false,
        channelTitle:
          channelClaim && channelClaim.value && channelClaim.value.title
            ? channelClaim.value.title
            : stripLeadingAtSign(channelClaim?.name),
      };
    } else {
      return {
        hasChannelData: false,
        isAnonymous: undefined,
        channelName: undefined,
        channelLink: undefined,
        channelTitle: undefined,
      };
    }
  };

  render() {
    const {
      uri,
      channelInfo,
      link,
      isResolvingUri,
      claim,
      children,
      inline,
      focusable = true,
      external = false,
      hideAnonymous = false,
      showAtSign,
      className,
      comment,
      showMemberBadge = true,
    } = this.props;

    if (!channelInfo && !claim) {
      return (
        <span className={classnames('empty', className)}>
          {uri === null ? '---' : isResolvingUri || claim === undefined ? __('Validating...') : __('[Removed]')}
        </span>
      );
    }

    const data = this.resolveState(channelInfo, claim, link);

    if (data.isAnonymous) {
      if (hideAnonymous) {
        return null;
      }

      return (
        <span dir="auto" className={classnames('channel-name', className, { 'channel-name--inline': inline })}>
          Anonymous
        </span>
      );
    }

    if (data.hasChannelData) {
      const { channelLink, channelTitle, channelName } = data;

      const inner = (
        <span dir="auto" className={classnames('channel-name', { 'channel-name--inline': inline })}>
          <p>{showAtSign ? channelName : stripLeadingAtSign(channelTitle)}</p>
          {!comment && showMemberBadge && <PremiumBadge uri={uri} />}
        </span>
      );

      if (!channelLink) {
        return inner;
      }

      if (children) {
        return (
          <Button
            aria-hidden={!focusable}
            tabIndex={focusable ? 0 : -1}
            className={className}
            target={external ? '_blank' : undefined}
            navigate={channelLink}
          >
            {children}
          </Button>
        );
      } else {
        return (
          <Button
            className={classnames(className, 'button--uri-indicator')}
            navigate={channelLink}
            target={external ? '_blank' : undefined}
            aria-hidden={!focusable}
            tabIndex={focusable ? 0 : -1}
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
