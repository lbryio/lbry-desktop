// @flow
import type { Node } from 'react';
import React, { useEffect, forwardRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { isEmpty } from 'util/object';
import { lazyImport } from 'util/lazyImport';
import classnames from 'classnames';
import { isURIValid } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { isChannelClaim } from 'util/claim';
import { formatLbryUrlForWeb } from 'util/url';
import { formatClaimPreviewTitle } from 'util/formatAriaLabel';
import { getChannelSubCountStr } from 'util/formatMediaDuration';
import { toCompactNotation } from 'util/string';
import ClaimPreviewProgress from 'component/claimPreviewProgress';
import Icon from 'component/common/icon';
import Tooltip from 'component/common/tooltip';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import PreviewOverlayProperties from 'component/previewOverlayProperties';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';
import ClaimSupportButton from 'component/claimSupportButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import ClaimPreviewTitle from 'component/claimPreviewTitle';
import ClaimPreviewSubtitle from 'component/claimPreviewSubtitle';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import FileWatchLaterLink from 'component/fileWatchLaterLink';
import PublishPending from 'component/publish/shared/publishPending';
import ButtonAddToQueue from 'component/buttonAddToQueue';
import ClaimMenuList from 'component/claimMenuList';
import ClaimPreviewReset from 'component/claimPreviewReset';
import ClaimPreviewLoading from 'component/common/claim-preview-loading';
import ClaimPreviewHidden from './internal/claim-preview-no-mature';
import ClaimPreviewNoContent from './internal/claim-preview-no-content';
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import CollectionEditButtons from 'component/collectionEditButtons';
import * as ICONS from 'constants/icons';
import { useIsMobile } from 'effects/use-screensize';
import CollectionPreviewOverlay from 'component/collectionPreviewOverlay';
import PreviewTilePurchaseOverlay from 'component/previewTilePurchaseOverlay';

const AbandonedChannelPreview = lazyImport(() =>
  import('component/abandonedChannelPreview' /* webpackChunkName: "abandonedChannelPreview" */)
);

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
  history: { push: (string | any) => void, location: { pathname: string, search: string } },
  title: string,
  nsfw: boolean,
  placeholder: string,
  type: string,
  nonClickable?: boolean,
  banState: { blacklisted?: boolean, filtered?: boolean, muted?: boolean, blocked?: boolean },
  geoRestriction: ?GeoRestriction,
  hasVisitedUri: boolean,
  blockedUris: Array<string>,
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
  isLivestream?: boolean,
  isLivestreamActive: boolean,
  livestreamViewerCount: ?number,
  collectionId?: string,
  isCollectionMine: boolean,
  disableNavigation?: boolean, // DEPRECATED - use 'nonClickable'. Remove this when channel-finder is consolidated (#810)
  mediaDuration?: string,
  date?: any,
  indexInContainer?: number, // The index order of this component within 'containerId'.
  channelSubCount?: number,
  swipeLayout: boolean,
  lang: string,
  showEdit?: boolean,
  dragHandleProps?: any,
  unavailableUris?: Array<string>,
  showMemberBadge?: boolean,
  inWatchHistory?: boolean,
  smallThumbnail?: boolean,
  showIndexes?: boolean,
  playItemsOnClick?: boolean,
  disableClickNavigation?: boolean,
  doClearContentHistoryUri: (uri: string) => void,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable?: boolean, isFloating?: boolean) => void,
  doDisablePlayerDrag?: (disable: boolean) => void,
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
    hasVisitedUri,
    // component
    history,
    wrapperElement,
    type,
    nonClickable,
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
    banState,
    geoRestriction,
    includeSupportAction,
    renderActions,
    hideMenu = false,
    // repostUrl,
    isLivestream,
    isLivestreamActive,
    livestreamViewerCount,
    collectionId,
    isCollectionMine,
    disableNavigation,
    indexInContainer,
    channelSubCount,
    swipeLayout = false,
    lang,
    showEdit,
    dragHandleProps,
    unavailableUris,
    showMemberBadge,
    inWatchHistory,
    smallThumbnail,
    showIndexes,
    playItemsOnClick,
    disableClickNavigation,
    doClearContentHistoryUri,
    doUriInitiatePlay,
    doDisablePlayerDrag,
  } = props;

  const isMobile = useIsMobile();

  const {
    location: { pathname, search },
  } = history;

  const playlistPreviewItem = unavailableUris !== undefined || showIndexes;
  const isCollection = claim && claim.value_type === 'collection';
  const collectionClaimId = isCollection && claim && claim.claim_id;
  const listId = collectionId || collectionClaimId;
  const WrapperElement = wrapperElement || 'li';
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);
  const abandoned = !isResolvingUri && !claim;
  const isMyCollection = listId && (isCollectionMine || listId.includes('-'));
  if (isMyCollection && claim === null && unavailableUris) unavailableUris.push(uri);

  const shouldHideActions = hideActions || isMyCollection || type === 'small' || type === 'tooltip';
  const channelSubscribers = React.useMemo(() => {
    if (channelSubCount === undefined) {
      return <span />;
    }
    const formattedSubCount = toCompactNotation(channelSubCount, lang, 10000);
    const formattedSubCountLocale = Number(channelSubCount).toLocaleString();
    return (
      <div className="media__subtitle">
        <Tooltip title={formattedSubCountLocale} followCursor placement="top">
          <span className="claim-preview__channel-sub-count">
            {getChannelSubCountStr(channelSubCount, formattedSubCount)}
          </span>
        </Tooltip>
      </div>
    );
  }, [channelSubCount]);
  const isValid = uri && isURIValid(uri, false);

  // $FlowFixMe
  const isPlayable =
    claim &&
    // $FlowFixMe
    claim.value &&
    // $FlowFixMe
    claim.value.stream_type &&
    // $FlowFixMe
    (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');
  const isChannelUri = isChannelClaim(claim, uri);
  const signingChannel = claim && claim.signing_channel;
  const repostedChannelUri =
    claim && claim.repost_channel_url && claim.value_type === 'channel'
      ? claim.permanent_url || claim.canonical_url
      : undefined;
  const repostedContentUri = claim && (claim.reposted_claim ? claim.reposted_claim.permanent_url : claim.permanent_url);
  const isPublishSuggestion = placeholder === 'publish' && !claim && uri.startsWith('lbry://@'); // See commit a43d9150.

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

  const ariaLabelData = isChannelUri ? title : formatClaimPreviewTitle(title, channelTitle, date, mediaDuration);

  const navigateUrl = formatLbryUrlForWeb((claim && claim.canonical_url) || uri || '/');
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
    if (playItemsOnClick && claim) {
      doUriInitiatePlay(
        {
          uri: claim?.canonical_url || uri,
          collection: { collectionId },
          source: collectionId === 'queue' ? collectionId : undefined,
        },
        true,
        disableClickNavigation
      );
    }
    if (onClick) {
      onClick(e, claim, indexInContainer); // not sure indexInContainer is used for anything.
    }
    e.stopPropagation();
  };

  const navLinkProps = {
    to: {
      pathname: disableClickNavigation ? pathname : navigateUrl,
      search: disableClickNavigation ? search : navigateSearch.toString() ? '?' + navigateSearch.toString() : '',
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
  if (!shouldHide && !claimIsMine && (banState.blacklisted || banState.filtered)) {
    shouldHide = true;
  }

  // block stream claims
  if (!shouldHide && !showUserBlocked && (banState.muted || banState.blocked)) {
    shouldHide = true;
  }

  if (!shouldHide && isPublishSuggestion) {
    shouldHide = true;
  }

  if (!shouldHide && !claimIsMine && geoRestriction) {
    shouldHide = true;
  }

  if (!shouldHide && customShouldHide && claim) {
    if (customShouldHide(claim)) {
      shouldHide = true;
    }
  }

  // **************************************************************************
  // **************************************************************************

  // Weird placement warning
  // Make sure this happens after we figure out if this claim needs to be hidden
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, shouldHide);

  function handleOnClick(e) {
    if (onClick) {
      onClick(e, claim, indexInContainer);
    }

    if (claim && !pending && !disableNavigation && !disableClickNavigation) {
      history.push({
        pathname: navigateUrl,
        search: navigateSearch.toString() ? '?' + navigateSearch.toString() : '',
      });
    }

    if (playItemsOnClick && claim) {
      doUriInitiatePlay(
        {
          uri: claim?.canonical_url || uri,
          collection: { collectionId },
          source: collectionId === 'queue' ? collectionId : undefined,
        },
        true,
        disableClickNavigation
      );
    }
  }

  function removeFromHistory(e, uri) {
    e.stopPropagation();
    doClearContentHistoryUri(uri);
  }

  useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, uri, isResolvingUri, shouldFetch, resolveUri]);

  // **************************************************************************
  // **************************************************************************

  if (!playlistPreviewItem && ((shouldHide && !showNullPlaceholder) || (isLivestream && !ENABLE_NO_SOURCE_CLAIMS))) {
    return null;
  }

  if (geoRestriction && !claimIsMine) {
    return null; // Ignore 'showNullPlaceholder'
  }

  if (placeholder === 'loading' || (uri && !claim && isResolvingUri)) {
    return (
      <ClaimPreviewLoading
        isChannel={isChannelUri}
        type={type}
        WrapperElement={WrapperElement}
        xsmall={smallThumbnail}
      />
    );
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

  if ((claim && showNullPlaceholder && shouldHide) || (!claim && playlistPreviewItem)) {
    return (
      <ClaimPreviewHidden
        message={!claim && playlistPreviewItem ? __('Deleted content') : __('This content is hidden')}
        isChannel={isChannelUri}
        type={type}
        uri={uri}
        collectionId={!claim && playlistPreviewItem && collectionId ? collectionId : undefined}
      />
    );
  }

  if (!claim && (showNullPlaceholder || empty)) {
    return empty || <ClaimPreviewNoContent isChannel={isChannelUri} type={type} />;
  }

  if (!shouldFetch && showUnresolvedClaim && !isResolvingUri && isChannelUri && claim === null) {
    return (
      <React.Suspense fallback={null}>
        <AbandonedChannelPreview uri={uri} type />
      </React.Suspense>
    );
  }

  if (isPublishSuggestion) {
    return null; // Ignore 'showNullPlaceholder'
  }

  let liveProperty = null;
  if (isLivestreamActive === true) {
    if (livestreamViewerCount) {
      liveProperty = (claim) => (
        <span className="livestream__viewer-count">
          {livestreamViewerCount} <Icon icon={ICONS.EYE} />
        </span>
      );
    } else {
      liveProperty = (claim) => <>LIVE</>;
    }
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
        'claim-preview__live': isLivestreamActive,
        'claim-preview__active': active,
        'non-clickable': nonClickable,
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
            'claim-preview--collection-editing': isMyCollection && showEdit,
            'swipe-list__item': swipeLayout,
          })}
        >
          {showIndexes && (
            <span className="card__subtitle card__subtitle--small-no-margin claim-preview__list-index">
              {indexInContainer + 1}
            </span>
          )}

          {isMyCollection && showEdit && (
            <CollectionEditButtons
              uri={uri}
              collectionId={listId}
              dragHandleProps={dragHandleProps}
              doDisablePlayerDrag={doDisablePlayerDrag}
            />
          )}

          {isChannelUri && claim ? (
            <UriIndicator focusable={false} uri={uri} link>
              <ChannelThumbnail
                uri={uri}
                small={type === 'inline'}
                showMemberBadge={showMemberBadge}
                checkMembership={false}
              />
            </UriIndicator>
          ) : (
            <>
              {!pending ? (
                <NavLink aria-hidden tabIndex={-1} {...navLinkProps}>
                  <FileThumbnail thumbnail={thumbnailUrl} small={smallThumbnail}>
                    <PreviewTilePurchaseOverlay uri={uri} />
                    {isPlayable && !smallThumbnail && (
                      <div className="claim-preview__hover-actions-grid">
                        <FileWatchLaterLink focusable={false} uri={repostedContentUri} />
                        <ButtonAddToQueue focusable={false} uri={repostedContentUri} />
                      </div>
                    )}
                    {(!isLivestream || isLivestreamActive) && (
                      <div className="claim-preview__file-property-overlay">
                        <PreviewOverlayProperties
                          uri={uri}
                          small={type === 'small'}
                          xsmall={smallThumbnail}
                          properties={liveProperty}
                        />
                      </div>
                    )}
                    {isCollection && <CollectionPreviewOverlay collectionId={listId} />}
                    <ClaimPreviewProgress uri={uri} />
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
              <div className="claim-tile__info" uri={uri}>
                {!isChannelUri && signingChannel && (
                  <div className="claim-preview__channel-staked">
                    <UriIndicator focusable={false} uri={uri} link hideAnonymous>
                      <ChannelThumbnail
                        uri={signingChannel.permanent_url}
                        xsmall
                        showMemberBadge={showMemberBadge}
                        checkMembership={false}
                      />
                    </UriIndicator>
                  </div>
                )}
                <ClaimPreviewSubtitle
                  uri={uri}
                  type={type}
                  showAtSign={isChannelUri}
                  showMemberBadge={!showMemberBadge}
                />
                {(pending || !!reflectingProgress) && <PublishPending uri={uri} />}
                {channelSubscribers}
              </div>
            </div>
            {type !== 'small' && (
              <div className="claim-preview__actions">
                {!pending && (
                  <>
                    {renderActions && claim && renderActions(claim)}
                    {shouldHideActions || renderActions ? null : actions !== undefined ? (
                      actions
                    ) : (
                      <div className="claim-preview__primary-actions">
                        {isChannelUri && !claimIsMine && (!banState.muted || showUserBlocked) && (
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
                    {typeof properties === 'function'
                      ? properties(claim)
                      : properties !== undefined
                      ? properties
                      : !isMobile && <ClaimTags uri={uri} type={type} />}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>
        {inWatchHistory && (
          <div onClick={(e) => removeFromHistory(e, uri)} className="claim-preview__history-remove">
            <Icon icon={ICONS.REMOVE} />
          </div>
        )}
        {/* Todo: check isLivestreamActive once we have that data consistently everywhere. */}
        {claim && isLivestream && <ClaimPreviewReset uri={uri} />}

        {!hideMenu && <ClaimMenuList uri={uri} collectionId={listId} />}
      </>
    </WrapperElement>
  );
});

export default withRouter(ClaimPreview);
