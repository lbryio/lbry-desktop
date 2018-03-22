// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelPage from 'page/channel';
import FilePage from 'page/file';
import Page from 'component/page';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  uri: string,
  claim: { name: string },
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
    const { claim, isResolvingUri, uri } = this.props;

    let innerContent = '';

    if ((isResolvingUri && !claim) || !claim) {
      innerContent = (
        <Page>
          <section className="card">
            <h1>{uri}</h1>
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
      innerContent = <FilePage uri={uri} />;
    }

    return innerContent;
  }
}

export default ShowPage;
