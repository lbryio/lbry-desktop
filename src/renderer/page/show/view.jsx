import Link from 'component/link/view';
import React from 'react';
import { BusyMessage } from 'component/common';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';

class ShowPage extends React.PureComponent {
  componentWillMount() {
    const { isResolvingUri, resolveUri, uri } = this.props;

    if (!isResolvingUri) resolveUri(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { isResolvingUri, resolveUri, claim, uri } = nextProps;
    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, isResolvingUri, uri, blackListedOutpoints } = this.props;

    let innerContent = '';

    if ((isResolvingUri && !claim) || !claim) {
      innerContent = (
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              <h1>{uri}</h1>
            </div>
          </div>
          <div className="card__content">
            {isResolvingUri && <BusyMessage message={__('Loading magic decentralized data...')} />}
            {claim === null &&
              !isResolvingUri && (
                <span className="empty">{__("There's nothing at this location.")}</span>
              )}
          </div>
        </section>
      );
    } else if (claim && claim.name.length && claim.name[0] === '@') {
      innerContent = <ChannelPage uri={uri} />;
    } else if (claim) {
      let isClaimBlackListed = false;

      blackListedOutpoints.forEach(outpoint => {
        if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) isClaimBlackListed = true;
      });

      if (isClaimBlackListed) {
        innerContent = (
          <section className="card">
            <div className="card__inner">
              <div className="card__title-identity">
                <h1>{uri}</h1>
              </div>
            </div>
            <div className="card__content">
              <p>
                {__(
                  'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
                )}
              </p>
            </div>
            <div className="card__actions">
              <Link button="alt" href="https://lbry.io/faq/dmca" label={__('Read More')} />
            </div>
          </section>
        );
      } else {
        innerContent = <FilePage uri={uri} />;
      }
    }

    return <main className="main--single-column">{innerContent}</main>;
  }
}

export default ShowPage;
