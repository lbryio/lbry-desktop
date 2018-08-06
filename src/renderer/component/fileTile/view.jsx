// @flow
import * as React from 'react';
import * as icons from 'constants/icons';
import type { Claim, Metadata } from 'types/claim';
import { normalizeURI, parseURI } from 'lbry-redux';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import Button from 'component/button';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';

type Props = {
  showUri: boolean,
  showLocal: boolean,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  isDownloaded: boolean,
  uri: string,
  isResolvingUri: boolean,
  rewardedContentClaimIds: Array<string>,
  claim: ?Claim,
  metadata: ?Metadata,
  resolveUri: string => void,
  navigate: (string, ?{}) => void,
  clearPublish: () => void,
  updatePublishForm: ({}) => void,
  hideNoResult: boolean, // don't show the tile if there is no claim at this uri
  displayHiddenMessage?: boolean,
  displayDescription?: boolean,
  small?: boolean,
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
    showUri: false,
    showLocal: false,
    displayDescription: true,
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
      obscureNsfw,
      claimIsMine,
      showLocal,
      isDownloaded,
      clearPublish,
      updatePublishForm,
      hideNoResult,
      displayHiddenMessage,
      displayDescription,
      small,
    } = this.props;

    const shouldHide = !claimIsMine && obscureNsfw && metadata && metadata.nsfw;
    if (shouldHide) {
      return displayHiddenMessage ? (
        <span className="help">
          {__('This file is hidden because it is marked NSFW. Update your')}{' '}
          <Button button="link" navigate="/settings" label={__('content viewing preferences')} />{' '}
          {__('to see it')}.
        </span>
      ) : null;
    }

    const uri = normalizeURI(this.props.uri);
    const isClaimed = !!claim;
    const description = isClaimed && metadata && metadata.description ? metadata.description : '';
    const title =
      isClaimed && metadata && metadata.title ? metadata.title : parseURI(uri).contentName;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);
    const onClick = () => navigate('/show', { uri });

    let name;
    let channel;
    if (claim) {
      ({ name } = claim);
      channel = claim.channel_name;
    }

    return !name && hideNoResult ? null : (
      <section
        className={classnames('file-tile card--link', {
          'file-tile--small': small,
        })}
        onClick={onClick}
        onKeyUp={onClick}
        role="button"
        tabIndex="0"
      >
        <CardMedia title={title || name} thumbnail={thumbnail} />
        <div className="file-tile__info">
          {isResolvingUri && <div className="card__title--small">{__('Loading...')}</div>}
          {!isResolvingUri && (
            <React.Fragment>
              <div
                className={classnames({
                  'card__title--file': !small,
                  'card__title--x-small': small,
                })}
              >
                <TruncatedText lines={small ? 2 : 3}>{title || name}</TruncatedText>
              </div>
              <div
                className={classnames('card__subtitle', {
                  'card__subtitle--x-small': small,
                })}
              >
                {showUri ? uri : channel || __('Anonymous')}
                {isRewardContent && <Icon icon={icons.FEATURED} />}
                {showLocal && isDownloaded && <Icon icon={icons.LOCAL} />}
              </div>
              <FilePrice hideFree uri={uri} />
              {displayDescription && (
                <div className="card__subtext card__subtext--small">
                  <TruncatedText lines={3}>{description}</TruncatedText>
                </div>
              )}
              {!name && (
                <React.Fragment>
                  {__('This location is unused.')}{' '}
                  <Button
                    button="link"
                    label={__('Put something here!')}
                    onClick={e => {
                      // avoid navigating to /show from clicking on the section
                      e.stopPropagation();
                      // strip prefix from the Uri and use that as navigation parameter
                      const nameFromUri = uri.replace(/lbry:\/\//g, '').replace(/-/g, ' ');
                      clearPublish(); // to remove any existing publish data
                      updatePublishForm({ name: nameFromUri }); // to populate the name
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
