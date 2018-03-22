// @flow
import * as React from 'react';
import * as icons from 'constants/icons';
import { normalizeURI, isURIClaimable, parseURI } from 'lbryURI';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import FilePrice from 'component/filePrice';
import Icon from 'component/common/icon';
import Button from 'component/button';
import classnames from 'classnames';

type Props = {
  fullWidth: boolean, // removes the max-width css
  showUri: boolean,
  showLocal: boolean,
  isDownloaded: boolean,
  uri: string,
  isResolvingUri: boolean,
  rewardedContentClaimIds: Array<string>,
  claim: ?{
    name: string,
    channel_name: string,
    claim_id: string,
  },
  metadata: {},
  resolveUri: string => void,
  navigate: (string, ?{}) => void,
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
    showUri: false,
    showLocal: false,
    fullWidth: false,
  };

  componentDidMount() {
    const { isResolvingUri, claim, uri, resolveUri } = this.props;
    if (!isResolvingUri && !claim && uri) resolveUri(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { isResolvingUri, claim, uri, resolveUri } = nextProps;
    if (!isResolvingUri && claim === undefined && uri) resolveUri(uri);
  }

  render() {
    const {
      claim,
      metadata,
      isResolvingUri,
      navigate,
      rewardedContentClaimIds,
      showUri,
      fullWidth,
      showLocal,
      isDownloaded,
    } = this.props;

    const uri = normalizeURI(this.props.uri);
    const isClaimed = !!claim;
    const title =
      isClaimed && metadata && metadata.title ? metadata.title : parseURI(uri).contentName;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    let onClick = () => navigate('/show', { uri });

    let name;
    let channel;
    if (claim) {
      name = claim.name;
      channel = claim.channel_name;
    }

    return (
      <section
        className={classnames('file-tile card--link', {
          'file-tile--fullwidth': fullWidth,
        })}
        onClick={onClick}
      >
        <CardMedia title={title || name} thumbnail={thumbnail} />
        <div className="file-tile__info">
          {isResolvingUri && <div className="card__title--small">{__('Loading...')}</div>}
          {!isResolvingUri && (
            <React.Fragment>
              <div className="card__title--small card__title--file">
                <TruncatedText lines={2}>{title || name}</TruncatedText>
              </div>
              <div className="card__subtitle">
                {showUri ? uri : channel || __('Anonymous')}
                {isRewardContent && <Icon icon={icons.FEATURED} />}
                {showLocal && isDownloaded && <Icon icon={icons.LOCAL} />}
              </div>
              {!name && (
                <React.Fragment>
                  {__('This location is unused.')}{' '}
                  <Button
                    button="link"
                    label={__('Put something here!')}
                    onClick={e => {
                      // avoid navigating to /show from clicking on the section
                      e.preventDefault();
                      navigate('/publish');
                    }}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
}

export default FileTile;
