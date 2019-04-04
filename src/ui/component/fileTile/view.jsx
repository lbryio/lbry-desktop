// @flow
import type { Claim, Metadata } from 'types/claim';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import { normalizeURI, parseURI } from 'lbry-redux';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import Button from 'component/button';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';
import Yrbl from 'component/yrbl';
import { withRouter } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  obscureNsfw: boolean,
  claimIsMine: boolean,
  isDownloaded: boolean,
  uri: string,
  isResolvingUri: boolean,
  rewardedContentClaimIds: Array<string>,
  claim: ?Claim,
  metadata: ?Metadata,
  resolveUri: string => void,
  clearPublish: () => void,
  updatePublishForm: ({}) => void,
  hideNoResult: boolean, // don't show the tile if there is no claim at this uri
  displayHiddenMessage?: boolean,
  size: string,
  isSubscribed: boolean,
  isNew: boolean,
  history: { push: string => void },
};

class FileTile extends React.PureComponent<Props> {
  static defaultProps = {
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
      isNew,
      claimIsMine,
    } = this.props;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    if (!isNew && !isSubscribed && !isRewardContent && !isDownloaded) {
      return null;
    }

    return (
      // TODO: turn this into it's own component and share it with FileCard
      // The only issue is icon placement on the search page
      <div className="media__properties">
        <FilePrice hideFree uri={uri} />
        {isNew && <span className="badge badge--alert icon">{__('NEW')}</span>}
        {isSubscribed && <Icon icon={ICONS.SUBSCRIPTION} />}
        {isRewardContent && <Icon iconColor="red" icon={ICONS.FEATURED} />}
        {!claimIsMine && isDownloaded && <Icon icon={ICONS.LOCAL} />}
        {claimIsMine && <Icon icon={ICONS.PUBLISHED} />}
      </div>
    );
  }

  render() {
    const {
      claim,
      metadata,
      isResolvingUri,
      obscureNsfw,
      claimIsMine,
      clearPublish,
      updatePublishForm,
      hideNoResult,
      displayHiddenMessage,
      size,
      history,
    } = this.props;

    if (!claim && isResolvingUri) {
      return (
        <div
          className={classnames('media-tile media-placeholder', {
            'media-tile--large': size === 'large',
          })}
        >
          <div className="media__thumb placeholder" />
          <div className="media__info">
            <div className="media__title placeholder" />
            <div className="media__channel placeholder" />
            <div className="media__subtitle placeholder" />
          </div>
        </div>
      );
    }

    const shouldHide = !claimIsMine && obscureNsfw && metadata && metadata.nsfw;
    if (shouldHide) {
      return displayHiddenMessage ? (
        <span className="help">
          {__('This file is hidden because it is marked NSFW. Update your')}{' '}
          <Button button="link" navigate="/$/settings" label={__('content viewing preferences')} />{' '}
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

    let height;
    let name;
    if (claim) {
      ({ name, height } = claim);
    }

    const wrapperProps = name
      ? {
        onClick: () => history.push(formatLbryUriForWeb(uri)),
        role: 'button',
      }
      : {};

    return !name && hideNoResult ? null : (
      <section
        className={classnames('media-tile', {
          'media-tile--small': size === 'small',
          'media-tile--large': size === 'large',
          'card--link': name,
        })}
        {...wrapperProps}
      >
        <CardMedia title={title || name} thumbnail={thumbnail} />
        <div className="media__info">
          {name && (
            <Fragment>
              <div className="media__title">
                {(title || name) && (
                  <TruncatedText text={title || name} lines={size !== 'small' ? 1 : 2} />
                )}
              </div>

              {size === 'small' && this.renderFileProperties()}

              {size !== 'small' ? (
                <div className="media__subtext">
                  {__('Published to')} <UriIndicator uri={uri} link />{' '}
                  <DateTime timeAgo block={height} />
                </div>
              ) : (
                <Fragment>
                  <div className="media__subtext">
                    <UriIndicator uri={uri} link />
                    <div>
                      <DateTime timeAgo block={height} />
                    </div>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}

          {size !== 'small' && (
            <div className="media__subtitle">
              <TruncatedText text={description} lines={size === 'large' ? 4 : 3} />
            </div>
          )}

          {size !== 'small' && this.renderFileProperties()}

          {!name && (
            <Yrbl
              className="yrbl--search"
              title={__("You get first dibs! There aren't any files here yet.")}
              subtitle={
                <Button
                  button="link"
                  label={
                    <Fragment>
                      {__('Publish something at')} {uri}
                    </Fragment>
                  }
                  onClick={e => {
                    // avoid navigating to /show from clicking on the section
                    e.stopPropagation();

                    // strip prefix from the Uri and use that as navigation parameter
                    const { claimName } = parseURI(uri);

                    clearPublish(); // to remove any existing publish data
                    updatePublishForm({ name: claimName }); // to populate the name
                    history.push('/publish');
                  }}
                />
              }
            />
          )}
        </div>
      </section>
    );
  }
}

export default withRouter(FileTile);
