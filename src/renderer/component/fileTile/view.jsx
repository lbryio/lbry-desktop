// @flow
import type { Claim, Metadata } from 'types/claim';
import * as ICONS from 'constants/icons';
import * as React from 'react';
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
  obscureNsfw: boolean,
  claimIsMine: boolean,
  isDownloaded: boolean,
  isSearchResult: boolean,
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
  isSubscribed: boolean,
  isNew: boolean,
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
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

  renderFileProperties() {
    const {
      isSubscribed,
      isDownloaded,
      claim,
      uri,
      rewardedContentClaimIds,
      size,
      isNew,
    } = this.props;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    if (!isNew && !isSubscribed && !isRewardContent && !isDownloaded) {
      return null;
    }

    return (
      <div className={classnames('media__properties', { card__subtitle: size === 'large' })}>
        <FilePrice hideFree uri={uri} />
        {isNew && <span className="badge badge--alert icon">{__('NEW')}</span>}
        {isSubscribed && <Icon icon={ICONS.SUBSCRIPTION} />}
        {isRewardContent && <Icon iconColor="red" icon={ICONS.FEATURED} />}
        {isDownloaded && <Icon icon={ICONS.LOCAL} />}
      </div>
    );
  }

  render() {
    const {
      claim,
      metadata,
      isResolvingUri,
      isSearchResult,
      navigate,
      obscureNsfw,
      claimIsMine,
      clearPublish,
      updatePublishForm,
      hideNoResult,
      displayHiddenMessage,
      displayDescription,
      size,
    } = this.props;

    if (!claim && isResolvingUri) {
      return (
        <div
          className={classnames('media-tile', {
            large: size === 'large',
          })}
        >
          <div className="card__placeholder card__media" />
          <div className="file-tile__info">
            <div className="card__placeholder title" />
            <div className="card__placeholder channel" />
            <div className="card__placeholder date" />
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
    const onClick = () => navigate('/show', { uri });

    let height;
    let name;
    if (claim) {
      ({ name, height } = claim);
    }

    return !name && hideNoResult ? null : (
      <section
        className={classnames('media-tile card--link', {
          'media--search-result': isSearchResult,
          'media--small': size === 'small',
          'media--large': size === 'large',
        })}
        onClick={onClick}
        onKeyUp={onClick}
        role="button"
        tabIndex="0"
      >
        <CardMedia title={title || name} thumbnail={thumbnail} />
        <div className="media__info">
          <div className="media__title">
            {(title || name) && (
              <TruncatedText text={title || name} lines={size === 'small' ? 2 : 3} />
            )}
          </div>
          <div className="media__subtext">
            <div className="media__subtitle">
              <UriIndicator uri={uri} link />
            </div>
            <div className="media__subtitle card--space-between">
              <div className="media__date">
                <DateTime timeAgo block={height} />
              </div>
              {size !== 'large' && this.renderFileProperties()}
            </div>
          </div>
          {displayDescription && (
            <div className="media__subtext">
              <TruncatedText text={description} lines={size === 'large' ? 4 : 3} />
            </div>
          )}
          {size === 'large' && this.renderFileProperties()}
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
                  const { claimName } = parseURI(uri);

                  clearPublish(); // to remove any existing publish data
                  updatePublishForm({ name: claimName }); // to populate the name
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
