// @flow
import React from 'react';
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
  totalPages: number,
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
    const { isResolvingUri, resolveUri, claim, uri, totalPages } = this.props;
    if (
      !isResolvingUri &&
      uri &&
      (claim === undefined || (claim && claim.name[0] === '@' && totalPages === undefined))
    ) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, isResolvingUri, uri, blackListedOutpoints, location } = this.props;
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

      for (let i = 0; i < blackListedOutpoints.length; i += 1) {
        const outpoint = blackListedOutpoints[i];
        if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) {
          isClaimBlackListed = true;
          break;
        }
      }

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
