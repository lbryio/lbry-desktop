// @flow
import type { Node } from 'react';
import React, { useEffect, forwardRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { isEmpty } from 'util/object';
import classnames from 'classnames';
import { isURIEqual, isURIValid } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { formatLbryUrlForWeb } from 'util/url';
import { formatClaimPreviewTitle } from 'util/formatAriaLabel';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';
import ClaimSupportButton from 'component/claimSupportButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import ClaimPreviewTitle from 'component/claimPreviewTitle';
import ClaimPreviewSubtitle from 'component/claimPreviewSubtitle';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import FileDownloadLink from 'component/fileDownloadLink';
import FileWatchLaterLink from 'component/fileWatchLaterLink';
import PublishPending from 'component/publishPending';
import ClaimMenuList from 'component/claimMenuList';
import ClaimPreviewLoading from './claim-preview-loading';
import ClaimPreviewHidden from './claim-preview-no-mature';
import ClaimPreviewNoContent from './claim-preview-no-content';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

import AbandonedChannelPreview from 'component/abandonedChannelPreview';

// preview images used on the landing page and on the channel page
type Props = {
  uri: string,
  claim: ?Claim,
  active: boolean,
  obscureNsfw: boolean,
  showUserBlocked: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  reflectingProgress?: any, // fxme
  resolveUri: (string) => void,
  isResolvingUri: boolean,
  history: { push: (string | any) => void },
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
  mutedUris: Array<string>,
  blockedUris: Array<string>,
  channelIsBlocked: boolean,
  actions: boolean | Node | string | number,
  properties: boolean | Node | string | number | ((Claim) => Node),
  empty?: Node,
  onClick?: (e: any, claim?: ?Claim, index?: number) => any,
  streamingUrl: ?string,
  getFile: (string) => void,
  customShouldHide?: (Claim) => boolean,
  searchParams?: { [string]: string },
  showUnresolvedClaim?: boolean,
  showNullPlaceholder?: boolean,
  includeSupportAction?: boolean,
  hideActions?: boolean,
  renderActions?: (Claim) => ?Node,
  wrapperElement?: string,
  hideRepostLabel?: boolean,
  repostUrl?: string,
  hideMenu?: boolean,
  collectionId?: string,
  editCollection: (string, CollectionEditParams) => void,
  isCollectionMine: boolean,
  collectionUris: Array<Collection>,
  collectionIndex?: number,
  disableNavigation?: boolean,
  mediaDuration?: string,
  date?: any,
  indexInContainer?: number, // The index order of this component within 'containerId'.
  channelSubCount?: number,
};

const ClaimPreview = forwardRef<any, {}>((props: Props, ref: any) => {
  const {
    // core
    uri,
    claim,
    isResolvingUri,
    // core actions
    getFile,
    resolveUri,
    // claim properties
    // is the claim consider nsfw?
    nsfw,
    date,
    title,
    claimIsMine,
    streamingUrl,
    mediaDuration,
    // user properties
    channelIsBlocked,
    hasVisitedUri,
    // component
    history,
    wrapperElement,
    type,
    placeholder,
    // pending
    reflectingProgress,
    pending,
    empty,
    // modifiers
    active,
    customShouldHide,
    searchParams,
    showNullPlaceholder,
    // value from show mature content user setting
    // true if the user doesn't wanna see nsfw content
    obscureNsfw,
    showUserBlocked,
    showUnresolvedClaim,
    hideRepostLabel = false,
    hideActions = false,
    properties,
    onClick,
    actions,
    mutedUris,
    blockedUris,
    blackListedOutpoints,
    filteredOutpoints,
    includeSupportAction,
    renderActions,
    hideMenu = false,
    // repostUrl,
    collectionId,
    collectionIndex,
    editCollection,
    isCollectionMine,
    collectionUris,
    disableNavigation,
    indexInContainer,
    channelSubCount,
  } = props;
  const isCollection = claim && claim.value_type === 'collection';
  const collectionClaimId = isCollection && claim && claim.claim_id;
  const listId = collectionId || collectionClaimId;
  const WrapperElement = wrapperElement || 'li';
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);
  const abandoned = !isResolvingUri && !claim;
  const isMyCollection = listId && (isCollectionMine || listId.includes('-'));
  const shouldHideActions = hideActions || isMyCollection || type === 'small' || type === 'tooltip';
  const canonicalUrl = claim && claim.canonical_url;
  const lastCollectionIndex = collectionUris ? collectionUris.length - 1 : 0;
  const channelSubscribers = React.useMemo(() => {
    if (channelSubCount === undefined) {
      return <span />;
    }
    const formattedSubCount = Number(channelSubCount).toLocaleString();
    return (
      <span className="claim-preview__channel-sub-count">
        {channelSubCount === 1 ? __('1 Follower') : __('%formattedSubCount% Followers', { formattedSubCount })}
      </span>
    );
  }, [channelSubCount]);
  const isValid = uri && isURIValid(uri);

  // $FlowFixMe
  const isPlayable =
    claim &&
    // $FlowFixMe
    claim.value &&
    // $FlowFixMe
    claim.value.stream_type &&
    // $FlowFixMe
    (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');
  const isChannelUri = claim ? claim.value_type === 'channel' : false;
  const signingChannel = claim && claim.signing_channel;
  const repostedChannelUri =
    claim && claim.repost_channel_url && claim.value_type === 'channel'
      ? claim.permanent_url || claim.canonical_url
      : undefined;

  // Get channel title ( use name as fallback )
  let channelTitle = null;
  if (signingChannel) {
    const { value, name } = signingChannel;
    if (value && value.title) {
      channelTitle = value.title;
    } else {
      channelTitle = name;
    }
  }

  // Aria-label value for claim preview
  let ariaLabelData = isChannelUri ? title : formatClaimPreviewTitle(title, channelTitle, date, mediaDuration);

  let navigateUrl = formatLbryUrlForWeb((claim && claim.canonical_url) || uri || '/');
  let navigateSearch = new URLSearchParams();
  if (listId) {
    navigateSearch.set(COLLECTIONS_CONSTS.COLLECTION_ID, listId);
  }
  if (searchParams) {
    Object.keys(searchParams).forEach((key) => {
      navigateSearch.set(key, searchParams[key]);
    });
  }

  const handleNavLinkClick = (e) => {
    if (onClick) {
      onClick(e, claim, indexInContainer); // not sure indexInContainer is used for anything.
    }
    e.stopPropagation();
  };

  const navLinkProps = {
    to: {
      pathname: navigateUrl,
      search: navigateSearch.toString() ? '?' + navigateSearch.toString() : '',
    },
    onClick: handleNavLinkClick,
    onAuxClick: handleNavLinkClick,
  };

  // do not block abandoned and nsfw claims if showUserBlocked is passed
  let shouldHide =
    placeholder !== 'loading' &&
    !showUserBlocked &&
    ((abandoned && !showUnresolvedClaim) || (!claimIsMine && obscureNsfw && nsfw));

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !claimIsMine && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !claimIsMine && !shouldHide && filteredOutpoints) {
    shouldHide = filteredOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // block stream claims
  if (claim && !shouldHide && !showUserBlocked && mutedUris.length && signingChannel) {
    shouldHide = mutedUris.some((blockedUri) => isURIEqual(blockedUri, signingChannel.permanent_url));
  }
  if (claim && !shouldHide && !showUserBlocked && blockedUris.length && signingChannel) {
    shouldHide = blockedUris.some((blockedUri) => isURIEqual(blockedUri, signingChannel.permanent_url));
  }

  if (!shouldHide && customShouldHide && claim) {
    if (customShouldHide(claim)) {
      shouldHide = true;
    }
  }

  // Weird placement warning
  // Make sure this happens after we figure out if this claim needs to be hidden
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, shouldHide);

  function handleOnClick(e) {
    if (onClick) {
      onClick(e, claim, indexInContainer);
    }

    if (claim && !pending && !disableNavigation) {
      history.push({
        pathname: navigateUrl,
        search: navigateSearch.toString() ? '?' + navigateSearch.toString() : '',
      });
    }
  }

  useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, uri, isResolvingUri, shouldFetch, resolveUri]);

  if (shouldHide && !showNullPlaceholder) {
    return null;
  }

  if (placeholder === 'loading' || (uri && !claim && isResolvingUri)) {
    return <ClaimPreviewLoading isChannel={isChannelUri} type={type} />;
  }

  if (claim && showNullPlaceholder && shouldHide && nsfw && obscureNsfw) {
    return (
      <ClaimPreviewHidden
        message={__('Mature content hidden by your preferences')}
        isChannel={isChannelUri}
        type={type}
      />
    );
  }

  if (claim && showNullPlaceholder && shouldHide) {
    return <ClaimPreviewHidden message={__('This content is hidden')} isChannel={isChannelUri} type={type} />;
  }

  if (!claim && (showNullPlaceholder || empty)) {
    return empty || <ClaimPreviewNoContent isChannel={isChannelUri} type={type} />;
  }

  if (!shouldFetch && showUnresolvedClaim && !isResolvingUri && isChannelUri && claim === null) {
    return <AbandonedChannelPreview uri={uri} type />;
  }
  if (placeholder === 'publish' && !claim && uri.startsWith('lbry://@')) {
    return null;
  }

  return (
    <WrapperElement
      ref={ref}
      role="link"
      onClick={pending || type === 'inline' ? undefined : handleOnClick}
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannelUri && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
        'claim-preview__active': active,
      })}
    >
      <>
        {!hideRepostLabel && <ClaimRepostAuthor uri={uri} />}

        <div
          className={classnames('claim-preview', {
            'claim-preview--small': type === 'small' || type === 'tooltip',
            'claim-preview--large': type === 'large',
            'claim-preview--inline': type === 'inline',
            'claim-preview--tooltip': type === 'tooltip',
            'claim-preview--channel': isChannelUri,
            'claim-preview--visited': !isChannelUri && !claimIsMine && hasVisitedUri,
            'claim-preview--pending': pending,
          })}
        >
          {isChannelUri && claim ? (
            <UriIndicator focusable={false} uri={uri} link>
              <ChannelThumbnail uri={uri} small={type === 'inline'} />
            </UriIndicator>
          ) : (
            <>
              {!pending ? (
                <NavLink aria-hidden tabIndex={-1} {...navLinkProps}>
                  <FileThumbnail thumbnail={thumbnailUrl}>
                    <div className="claim-preview__hover-actions">
                      {isPlayable && <FileWatchLaterLink focusable={false} uri={uri} />}
                    </div>
                    {/* @if TARGET='app' */}
                    <div className="claim-preview__hover-actions">
                      {claim && !isCollection && (
                        <FileDownloadLink focusable={false} uri={canonicalUrl} hideOpenButton hideDownloadStatus />
                      )}
                    </div>
                    {/* @endif */}
                  </FileThumbnail>
                </NavLink>
              ) : (
                <FileThumbnail thumbnail={thumbnailUrl} />
              )}
            </>
          )}

          <div className="claim-preview__text">
            <div className="claim-preview-metadata">
              <div className="claim-preview-info">
                {pending ? (
                  <ClaimPreviewTitle uri={uri} />
                ) : (
                  <NavLink aria-label={ariaLabelData} aria-current={active ? 'page' : null} {...navLinkProps}>
                    <ClaimPreviewTitle uri={uri} />
                  </NavLink>
                )}
              </div>
              <ClaimPreviewSubtitle uri={uri} type={type} />
              {(pending || !!reflectingProgress) && <PublishPending uri={uri} />}
              {channelSubscribers}
            </div>
            {type !== 'small' && (
              <div className="claim-preview__actions">
                {!pending && (
                  <>
                    {renderActions && claim && renderActions(claim)}
                    {Boolean(isMyCollection && listId) && (
                      <>
                        <div className="collection-preview__edit-buttons">
                          <div className="collection-preview__edit-group">
                            <Button
                              button="alt"
                              className={'button-collection-order'}
                              disabled={collectionIndex === 0}
                              icon={ICONS.UP}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editCollection) {
                                  // $FlowFixMe
                                  editCollection(listId, {
                                    order: { from: collectionIndex, to: Number(collectionIndex) - 1 },
                                  });
                                }
                              }}
                            />
                            <Button
                              button="alt"
                              className={'button-collection-order'}
                              icon={ICONS.DOWN}
                              disabled={collectionIndex === lastCollectionIndex}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (editCollection) {
                                  // $FlowFixMe
                                  editCollection(listId, {
                                    order: { from: collectionIndex, to: Number(collectionIndex + 1) },
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="collection-preview__edit-group">
                            <Button
                              button="alt"
                              icon={ICONS.DELETE}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // $FlowFixMe
                                if (editCollection) editCollection(listId, { claims: [claim], remove: true });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {shouldHideActions || renderActions ? null : actions !== undefined ? (
                      actions
                    ) : (
                      <div className="claim-preview__primary-actions">
                        {!isChannelUri && signingChannel && (
                          <div className="claim-preview__channel-staked">
                            <ChannelThumbnail uri={signingChannel.permanent_url} xsmall />
                          </div>
                        )}

                        {isChannelUri && !channelIsBlocked && !claimIsMine && (
                          <SubscribeButton
                            uri={repostedChannelUri || (uri.startsWith('lbry://') ? uri : `lbry://${uri}`)}
                          />
                        )}

                        {includeSupportAction && <ClaimSupportButton uri={uri} />}
                      </div>
                    )}
                  </>
                )}
                {claim && (
                  <React.Fragment>
                    {typeof properties === 'function' ? (
                      properties(claim)
                    ) : properties !== undefined ? (
                      properties
                    ) : (
                      <ClaimTags uri={uri} type={type} />
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>
        {!hideMenu && <ClaimMenuList uri={uri} collectionId={listId} />}
      </>
    </WrapperElement>
  );
});

export default withRouter(ClaimPreview);
