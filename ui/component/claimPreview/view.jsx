// @flow
import type { Node } from 'react';
import React, { Fragment, useEffect, forwardRef } from 'react';
import classnames from 'classnames';
import { parseURI, convertToShareLink } from 'lbry-redux';
import { withRouter } from 'react-router-dom';
import { openCopyLinkMenu } from 'util/context-menu';
import { formatLbryUrlForWeb } from 'util/url';
import { isEmpty } from 'util/object';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import FileProperties from 'component/fileProperties';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';
import BlockButton from 'component/blockButton';
import Button from 'component/button';
import useGetThumbnail from 'effects/use-get-thumbnail';

type Props = {
  uri: string,
  claim: ?Claim,
  obscureNsfw: boolean,
  showUserBlocked: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
  history: { push: string => void },
  thumbnail: string,
  title: string,
  nsfw: boolean,
  placeholder: string,
  type: string,
  hasVisitedUri: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  blockedChannelUris: Array<string>,
  channelIsBlocked: boolean,
  isSubscribed: boolean,
  beginPublish: string => void,
  actions: boolean | Node | string | number,
  properties: boolean | Node | string | number,
  onClick?: any => any,
  hideBlock?: boolean,
  streamingUrl: ?string,
  getFile: string => void,
  customShouldHide?: Claim => boolean,
};

const ClaimPreview = forwardRef<any, {}>((props: Props, ref: any) => {
  const {
    obscureNsfw,
    claimIsMine,
    pending,
    history,
    uri,
    isResolvingUri,
    thumbnail,
    title,
    nsfw,
    resolveUri,
    claim,
    placeholder,
    type,
    blackListedOutpoints,
    filteredOutpoints,
    blockedChannelUris,
    hasVisitedUri,
    showUserBlocked,
    channelIsBlocked,
    isSubscribed,
    beginPublish,
    actions,
    properties,
    onClick,
    hideBlock,
    getFile,
    streamingUrl,
    customShouldHide,
  } = props;
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);
  const abandoned = !isResolvingUri && !claim;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const showPublishLink = abandoned && placeholder === 'publish';
  const hideActions = type === 'small' || type === 'tooltip';
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile) || thumbnail;

  let name;
  let isValid = false;
  if (uri) {
    try {
      ({ streamName: name } = parseURI(uri));
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const isChannel = isValid ? parseURI(uri).isChannel : false;
  const includeChannelTooltip = type !== 'inline' && type !== 'tooltip' && !isChannel;
  const signingChannel = claim && claim.signing_channel;

  // do not block abandoned and nsfw claims if showUserBlocked is passed
  let shouldHide =
    placeholder !== 'loading' &&
    !showUserBlocked &&
    ((abandoned && !showPublishLink) || (!claimIsMine && obscureNsfw && nsfw));

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !claimIsMine && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      outpoint =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !claimIsMine && !shouldHide && filteredOutpoints) {
    shouldHide = filteredOutpoints.some(
      outpoint =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // block stream claims
  if (claim && !shouldHide && !showUserBlocked && blockedChannelUris.length && signingChannel) {
    shouldHide = blockedChannelUris.some(blockedUri => blockedUri === signingChannel.permanent_url);
  }
  // block channel claims if we can't control for them in claim search
  // e.g. fetchRecommendedSubscriptions
  if (claim && isChannel && !shouldHide && !showUserBlocked && blockedChannelUris.length) {
    shouldHide = blockedChannelUris.some(blockedUri => blockedUri === claim.permanent_url);
  }

  if (!shouldHide && customShouldHide && claim) {
    if (customShouldHide(claim)) {
      shouldHide = true;
    }
  }

  function handleContextMenu(e) {
    // @if TARGET='app'
    e.preventDefault();
    e.stopPropagation();
    if (claim) {
      openCopyLinkMenu(convertToShareLink(claim.canonical_url || claim.permanent_url), e);
    }
    // @endif
  }

  function handleOnClick(e) {
    if (onClick) {
      onClick(e);
    } else if ((isChannel || title) && !pending) {
      history.push(formatLbryUrlForWeb(claim && claim.canonical_url ? claim.canonical_url : uri));
    }
  }

  useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, shouldFetch]);

  if (shouldHide) {
    return null;
  }

  if (placeholder === 'loading' || (isResolvingUri && !claim)) {
    return (
      <li className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })} disabled>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-preview-title" />
          <div className="placeholder media__subtitle" />
        </div>
      </li>
    );
  }

  if (placeholder === 'publish' && !claim && uri.startsWith('lbry://@')) {
    return null;
  }

  return (
    <li
      ref={ref}
      role="link"
      onClick={pending || type === 'inline' ? undefined : handleOnClick}
      onContextMenu={handleContextMenu}
      className={classnames('claim-preview', {
        'claim-preview--small': type === 'small' || type === 'tooltip',
        'claim-preview--large': type === 'large',
        'claim-preview--inline': type === 'inline',
        'claim-preview--tooltip': type === 'tooltip',
        'claim-preview--channel': isChannel,
        'claim-preview--visited': !isChannel && !claimIsMine && hasVisitedUri,
        'claim-preview--pending': pending,
      })}
    >
      {isChannel && claim ? (
        <UriIndicator uri={uri} link>
          <ChannelThumbnail uri={uri} obscure={channelIsBlocked} />
        </UriIndicator>
      ) : (
        <FileThumbnail thumbnail={thumbnailUrl} />
      )}
      <div className="claim-preview__text">
        <div className="claim-preview-metadata">
          <div className="claim-preview-info">
            <div className="claim-preview-title">
              {claim ? <TruncatedText text={title || claim.name} lines={2} /> : <span>{__('Nothing here')}</span>}
            </div>
            {!isChannel && claim && <FileProperties uri={uri} />}
          </div>

          <div className="media__subtitle">
            {!isResolvingUri && (
              <div>
                {claim ? (
                  <React.Fragment>
                    <UriIndicator uri={uri} link addTooltip={includeChannelTooltip} />{' '}
                    {pending
                      ? __('Pending...')
                      : claim &&
                        (isChannel ? (
                          type !== 'inline' && `${claimsInChannel} ${__('publishes')}`
                        ) : (
                          <DateTime timeAgo uri={uri} />
                        ))}
                  </React.Fragment>
                ) : (
                  <Fragment>
                    <div>{__('Publish something and claim this spot!')}</div>
                    <div className="card__actions">
                      <Button
                        onClick={() => beginPublish(name)}
                        button="primary"
                        label={`${__('Publish to')}  ${uri}`}
                      />
                    </div>
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="claim-preview__actions">
          {!pending && (
            <React.Fragment>
              {hideActions ? null : actions !== undefined ? (
                actions
              ) : (
                <div className="card__actions--inline">
                  {isChannel && !channelIsBlocked && !claimIsMine && (
                    <SubscribeButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                  )}
                  {!hideBlock && isChannel && !isSubscribed && !claimIsMine && (
                    <BlockButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                  )}
                </div>
              )}
            </React.Fragment>
          )}
          {properties !== undefined ? properties : <ClaimTags uri={uri} type={type} />}
        </div>
      </div>
    </li>
  );
});

export default withRouter(ClaimPreview);
