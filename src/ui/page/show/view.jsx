// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import { Redirect } from 'react-router';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';
import Page from 'component/page';
import Button from 'component/button';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  uri: string,
  claim: StreamClaim,
  location: UrlLocation,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

class ShowPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { isResolvingUri, resolveUri, uri } = this.props;

    if (!isResolvingUri) resolveUri(uri);
  }

  componentDidUpdate() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && claim === undefined) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, isResolvingUri, uri, blackListedOutpoints, location } = this.props;
    const { channelName, channelClaimId, streamName, streamClaimId } = parseURI(uri);
    const signingChannel = claim && claim.signing_channel;

    // @routinghax
    if (channelName && !channelClaimId && streamName && !streamClaimId && !isResolvingUri && !claim) {
      // Kinda hacky, but this is probably an old url
      // Just redirect to the vanity channel
      return <Redirect to={`/@${channelName}`} />;
    }

    let innerContent = '';

    if (!claim || (claim && !claim.name)) {
      if (claim && !claim.name) {
        // While testing the normalization changes, Brannon found that `name` was missing sometimes
        // This shouldn't happen, so hopefully this helps track it down
        console.error('No name for associated claim: ', claim.claim_id); // eslint-disable-line no-console
      }

      innerContent = (
        <Page>
          {isResolvingUri && <BusyIndicator message={__('Loading decentralized data...')} />}
          {!isResolvingUri && <span className="empty">{__("There's nothing available at this location.")}</span>}
        </Page>
      );
    } else if (claim.name.length && claim.name[0] === '@') {
      innerContent = <ChannelPage uri={uri} location={location} />;
    } else if (claim && blackListedOutpoints) {
      let isClaimBlackListed = false;

      isClaimBlackListed = blackListedOutpoints.some(
        outpoint =>
          (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
          (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
      );

      if (isClaimBlackListed) {
        innerContent = (
          <Page>
            <section className="card card--section">
              <div className="card__title">{uri}</div>
              <p>
                {__(
                  'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
                )}
              </p>
              <div className="card__actions">
                <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
              </div>
            </section>
          </Page>
        );
      } else {
        innerContent = <FilePage uri={uri} location={location} />;
      }
    }

    return innerContent;
  }
}

export default ShowPage;
