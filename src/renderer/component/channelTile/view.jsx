// @flow
import * as React from 'react';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';

/*
  This component can probably be combined with FileTile
  Currently the only difference is showing the number of files/empty channel
*/

type Props = {
  uri: string,
  isResolvingUri: boolean,
  totalItems: number,
  claim: ?{
    claim_id: string,
    name: string,
  },
  resolveUri: string => void,
  navigate: (string, ?{}) => void,
};

class ChannelTile extends React.PureComponent<Props> {
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
    const { claim, navigate, isResolvingUri, totalItems, uri } = this.props;
    let channelName, channelId;

    if (claim) {
      channelName = claim.name;
      channelId = claim.claim_id;
    }

    const onClick = () => navigate('/show', { uri });

    return (
      <section className="file-tile card--link" onClick={onClick} role="button">
        <CardMedia title={channelName} thumbnail={null} />
        <div className="file-tile__info">
          {isResolvingUri && <div className="card__title--small">{__('Loading...')}</div>}
          {!isResolvingUri && (
            <React.Fragment>
              <div className="card__title--small card__title--file">
                <TruncatedText lines={1}>{channelName || uri}</TruncatedText>
              </div>
              <div className="card__subtitle">
                {totalItems > 0 && (
                  <span>
                    {totalItems} {totalItems === 1 ? 'file' : 'files'}
                  </span>
                )}
                {!isResolvingUri && !totalItems && <span>This is an empty channel.</span>}
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
}

export default ChannelTile;
