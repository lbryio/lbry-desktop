// @flow
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';

import PreviewLink from 'component/previewLink';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  thumbnail: ?string,
  autoEmbed: ?boolean,
  description: ?string,
  isResolvingUri: boolean,
  resolveUri: string => void,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

class ClaimLink extends React.Component<Props> {
  static defaultProps = {
    href: null,
    title: null,
  };

  isClaimBlackListed() {
    const { claim, blackListedOutpoints } = this.props;

    if (claim && blackListedOutpoints) {
      let blackListed = false;

      for (let i = 0; i < blackListedOutpoints.length; i += 1) {
        const outpoint = blackListedOutpoints[i];
        if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) {
          blackListed = true;
          break;
        }
      }
      return blackListed;
    }
  }

  componentDidMount() {
    const { isResolvingUri, resolveUri, uri, claim } = this.props;
    if (!isResolvingUri && !claim) {
      resolveUri(uri);
    }
  }

  componentDidUpdate() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && !claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { uri, claim, title, autoEmbed, children, isResolvingUri } = this.props;
    const { claimName } = parseURI(uri);
    const blackListed = this.isClaimBlackListed();
    const showPreview = autoEmbed === true && !blackListed && !isResolvingUri && claim !== null;

    return (
      <React.Fragment>
        <Button title={title || claimName} button={'link'} label={children} navigate={uri} />
        {showPreview && <PreviewLink uri={uri} />}
      </React.Fragment>
    );
  }
}

export default ClaimLink;
