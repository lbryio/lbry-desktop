// @flow
import React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import Tooltip from 'component/common/tooltip';
import ClaimPreview from 'component/claimPreview';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?Claim,
  addTooltip: boolean,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: string => void,
  uri: string,
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
    const { link, isResolvingUri, claim, addTooltip } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    const isChannelClaim = claim.value_type === 'channel';

    if (!claim.signing_channel && !isChannelClaim) {
      return <span className="channel-name">Anonymous</span>;
    }

    const channelClaim = isChannelClaim ? claim : claim.signing_channel;

    if (channelClaim) {
      const { name, claim_id: claimId } = channelClaim;
      let channelLink;

      // Disabling now because it mostly causes issues
      // Add this back to ensure we only add links to signed channels
      // if (claim.is_channel_signature_valid) {
      channelLink = link ? buildURI({ channelName: name, claimId }) : false;
      // }

      const inner = <span className="channel-name">{name}</span>;

      if (!channelLink) {
        return inner;
      }

      const Wrapper = addTooltip
        ? ({ children }) => (
            <Tooltip label={<ClaimPreview uri={channelLink} type="tooltip" placeholder={false} />}>{children}</Tooltip>
          )
        : 'span';

      return (
        <Button className="button--uri-indicator" navigate={channelLink}>
          <Wrapper>{inner}</Wrapper>
        </Button>
      );
    } else {
      return null;
    }
  }
}

export default UriIndicator;
