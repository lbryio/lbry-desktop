// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';
import Page from 'component/page';
import Button from 'component/button';
import type { Claim } from 'types/claim';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  uri: string,
  claim: Claim,
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

  componentWillReceiveProps(nextProps: Props) {
    const { isResolvingUri, resolveUri, claim, uri } = nextProps;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, isResolvingUri, uri, blackListedOutpoints } = this.props;

    let innerContent = '';

    if ((isResolvingUri && !claim) || !claim) {
      const { claimName } = parseURI(uri);
      innerContent = (
        <Page>
          <section className="card">
            <h1>{claimName}</h1>
            <div className="card__content">
              {isResolvingUri && <BusyIndicator message={__('Loading decentralized data...')} />}
              {claim === null &&
                !isResolvingUri && (
                  <span className="empty">{__("There's nothing at this location.")}</span>
                )}
            </div>
          </section>
        </Page>
      );
    } else if (claim && claim.name.length && claim.name[0] === '@') {
      innerContent = <ChannelPage uri={uri} />;
    } else if (claim) {
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
              <div className="card__content">
                <p>
                  {__(
                    'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
                  )}
                </p>
              </div>
              <div className="card__actions">
                <Button button="link" href="https://lbry.io/faq/dmca" label={__('Read More')} />
              </div>
            </section>
          </Page>
        );
      } else {
        innerContent = <FilePage uri={uri} />;
      }
    }

    return innerContent;
  }
}

export default ShowPage;
