/* eslint-disable */
import React from 'react';
import { BusyMessage } from 'component/common';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  uri: string,
  claim: { name: string },
};

class ShowPage extends React.PureComponent<Props> {
  componentWillMount() {
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
    const { claim, isResolvingUri, uri } = this.props;

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
      innerContent = <FilePage uri={uri} />;
    }

    return innerContent;
  }
}

export default ShowPage;
/* eslint-enable */
