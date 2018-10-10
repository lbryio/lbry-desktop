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
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';

type Props = {
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
  size: string,
  subscribed: boolean,
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
    showLocal: false,
    displayDescription: true,
    size: 'regular',
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
      obscureNsfw,
      claimIsMine,
      showLocal,
      isDownloaded,
      clearPublish,
      updatePublishForm,
      hideNoResult,
      displayHiddenMessage,
      displayDescription,
      size,
      subscribed,
    } = this.props;

    if (!claim && isResolvingUri) {
      return (
        <div
          className={classnames('file-tile', {
            'file-tile--small': size === 'small',
            'file-tile--large': size === 'large',
          })}
        >
          <div className="card--placeholder card__media" />
          <div className="file-tile__info">
            <div className="card--placeholder placeholder__title--tile" />
            <div className="card--placeholder placeholder__channel" />
            <div className="card--placeholder placeholder__date" />
          </div>
        </div>
      );
    }

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

    let height;
    let name;
    if (isClaimed) {
      ({ name, height } = claim);
    }

    return !name && hideNoResult ? null : (
      <section
        className={classnames('file-tile card--link', {
          'file-tile--small': size === 'small',
          'file-tile--large': size === 'large',
        })}
        onClick={onClick}
        onKeyUp={onClick}
        role="button"
        tabIndex="0"
      >
        <CardMedia title={title || name} thumbnail={thumbnail} />
        <div className="file-tile__info">
          <div className="file-tile__title">
            <TruncatedText text={title || name} lines={size === 'small' ? 2 : 3} />
          </div>
          <div className="card__subtitle">
            <UriIndicator uri={uri} link />
          </div>
          <div className="card__subtitle card--space-between">
            <DateTime timeAgo block={height} />
            <div className="card__file-properties">
              <FilePrice hideFree uri={uri} />
              {subscribed && <Icon icon={icons.HEART} />}
              {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
              {showLocal && isDownloaded && <Icon icon={icons.LOCAL} />}
            </div>
          </div>
          {displayDescription && (
            <div className="card__subtext">
              <TruncatedText text={description} lines={size === 'large' ? 4 : 3} />
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
        </div>
      </section>
    );
  }
}

export default FileTile;
