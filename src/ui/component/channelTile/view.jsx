// @flow
import * as React from 'react';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import classnames from 'classnames';
import SubscribeButton from 'component/subscribeButton';
import type { Claim } from 'types/claim';

type Props = {
  uri: string,
  isResolvingUri: boolean,
  totalItems: number,
  size: string,
  claim: ?Claim,
  resolveUri: string => void,
  navigate: (string, ?{}) => void,
};

class ChannelTile extends React.PureComponent<Props> {
  static defaultProps = {
    size: 'regular',
  };

  componentDidMount() {
    const { uri, resolveUri } = this.props;

    resolveUri(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { uri, resolveUri } = this.props;

    if (nextProps.uri !== uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, navigate, isResolvingUri, totalItems, uri, size } = this.props;

    let channelName;
    let subscriptionUri;
    if (claim) {
      channelName = claim.name;
      subscriptionUri = `lbry://${claim.permanent_url}`;
    }

    const onClick = () => navigate('/show', { uri, page: 1 });

    return (
      <section
        onClick={onClick}
        role="button"
        className={classnames('media-tile card--link', {
          'media-tile--small': size === 'small',
          'media-tile--large': size === 'large',
        })}
      >
        <CardMedia title={channelName} thumbnail={null} />
        <div className="media__info">
          {isResolvingUri && <div className="media__title">{__('Loading...')}</div>}
          {!isResolvingUri && (
            <React.Fragment>
              <div className="media__title">
                <TruncatedText text={channelName || uri} lines={1} />
              </div>
              <div className="media__subtitle">
                {totalItems > 0 && (
                  <span>
                    {totalItems} {totalItems === 1 ? 'publish' : 'publishes'}
                  </span>
                )}
                {!isResolvingUri && !totalItems && <span>This is an empty channel.</span>}
              </div>
            </React.Fragment>
          )}
          {subscriptionUri && (
            <div className="media__actions">
              <SubscribeButton buttonStyle="inverse" uri={subscriptionUri} />
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default ChannelTile;
