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
  size: string,
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
    showUri: false,
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
      size,
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
    if (claim) {
      ({ name } = claim);
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
          {isResolvingUri && (
            <div
              className={classnames({
                'card__title--small': size !== 'large',
                'card__title--large': size === 'large',
              })}
            >
              {__('Loading...')}
            </div>
          )}
          {!isResolvingUri && (
            <React.Fragment>
              <div
                className={classnames({
                  'card__title--file': size === 'regular',
                  'card__title--x-small': size === 'small',
                  'card__title--large': size === 'large',
                })}
              >
                <TruncatedText lines={size === 'small' ? 2 : 3}>{title || name}</TruncatedText>
              </div>
              <div
                className={classnames('card__subtitle', {
                  'card__subtitle--x-small': size === 'small',
                  'card__subtitle--large': size === 'large',
                })}
              >
                <span className="file-tile__channel">
                  {showUri ? uri : <UriIndicator uri={uri} link />}
                </span>
              </div>
              <div className="card__file-properties">
                <FilePrice hideFree uri={uri} />
                {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
                {showLocal && isDownloaded && <Icon icon={icons.LOCAL} />}
              </div>
              {displayDescription && (
                <div
                  className={classnames('card__subtext', {
                    'card__subtext--small': size !== 'small',
                    'card__subtext--large': size === 'large',
                  })}
                >
                  <TruncatedText lines={size === 'large' ? 4 : 3}>{description}</TruncatedText>
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
