// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in TextViewer and FileRenderFloating
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import { useIsMobile } from 'effects/use-screensize';
import React from 'react';
import classnames from 'classnames';
import * as PAGES from 'constants/pages';
import * as RENDER_MODES from 'constants/file_render_modes';
import Button from 'component/button';
import Nag from 'component/nag';
import PaidContentOverlay from 'component/paidContentOverlay';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { LivestreamContext } from 'page/livestream/view';
import { formatLbryUrlForWeb } from 'util/url';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import useFetchLiveStatus from 'effects/use-fetch-live';
import useGetPoster from 'effects/use-get-poster';
import { ChatCommentContext } from 'component/chat/chatComment/view';
import { ExpandableContext } from 'component/common/expandable';

type Action = 'default_button' | 'paid_overlay' | 'membership_overlay' | '';

type Props = {
  channelClaimId: ?string,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  history: { push: (params: string | { pathname: string, state: ?{} }) => void },
  location: {
    search: ?string,
    pathname: string,
    href: string,
    state: ?{ forceAutoplay?: boolean, forceDisableAutoplay?: boolean },
  },
  obscurePreview: boolean,
  insufficientCredits: boolean,
  claimThumbnail?: string,
  autoplay: boolean,
  costInfo: any,
  inline: boolean,
  renderMode: string,
  sdkPaid: boolean,
  fiatPaid: boolean,
  fiatRequired: boolean,
  isFetchingPurchases: boolean,
  authenticated: boolean,
  videoTheaterMode: boolean,
  isCurrentClaimLive?: boolean,
  isLivestreamClaim: boolean,
  customAction?: any,
  embedded?: boolean,
  parentCommentId?: string,
  isMarkdownPost?: boolean,
  claimLinkId?: string,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable: boolean) => void,
  doFetchChannelLiveStatus: (string) => void,
  claimIsMine: boolean,
  protectedMembershipIds?: Array<number>,
  validMembershipIds?: Array<number>,
  protectedContentTag?: string,
  contentRestrictedFromUser: boolean,
  contentUnlocked: boolean,
};

export default function FileRenderInitiator(props: Props) {
  const {
    authenticated,
    autoplay,
    channelClaimId,
    claimIsMine,
    claimLinkId,
    claimThumbnail,
    sdkPaid,
    fiatPaid,
    fiatRequired,
    isFetchingPurchases,
    costInfo,
    customAction,
    doFetchChannelLiveStatus,
    doUriInitiatePlay,
    embedded,
    fileInfo,
    history,
    insufficientCredits,
    isCurrentClaimLive,
    isLivestreamClaim,
    isMarkdownPost,
    isPlaying,
    location,
    obscurePreview,
    parentCommentId,
    renderMode,
    uri,
    videoTheaterMode,
    // contentRestrictedFromUser,
    contentUnlocked,
  } = props;

  const { isLiveComment } = React.useContext(ChatCommentContext) || {};
  const { setExpanded, disableExpanded } = React.useContext(ExpandableContext) || {};

  const theaterMode = renderMode === 'video' || renderMode === 'audio' ? videoTheaterMode : false;
  const { livestreamPage, layountRendered } = React.useContext(LivestreamContext) || {};

  const isMobile = useIsMobile();

  const { search, href, state: locationState, pathname } = location;
  const { forceAutoplay: forceAutoplayParam, forceDisableAutoplay } = locationState || {};
  const urlParams = search && new URLSearchParams(search);
  const collectionId = urlParams && urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  // check if there is a time or autoplay parameter, if so force autoplay
  const urlTimeParam = href && href.indexOf('t=') > -1;

  const shouldAutoplay = !forceDisableAutoplay && !embedded && (forceAutoplayParam || urlTimeParam || autoplay);
  const sdkFeeRequired = costInfo && costInfo.cost !== 0;
  const isFree = costInfo && costInfo.cost === 0 && !fiatRequired;
  const isAnonymousFiatContent = fiatRequired && !channelClaimId;

  const cannotViewFile =
    (!claimIsMine &&
      ((fiatRequired && (!fiatPaid || isFetchingPurchases)) || (sdkFeeRequired && !sdkPaid) || !contentUnlocked)) ||
    (isLivestreamClaim && isCurrentClaimLive && !layountRendered && !isMobile);
  const canViewFile = !cannotViewFile;

  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;

  const renderUnsupported = RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode);

  const disabled =
    !contentUnlocked ||
    isAnonymousFiatContent ||
    (isLivestreamClaim && !isCurrentClaimLive) ||
    renderUnsupported ||
    (!fileInfo && insufficientCredits && !sdkPaid);

  const action: Action = getActionType();

  const shouldRedirect = !authenticated && !isFree;

  function doAuthRedirect() {
    history.push(`/$/${PAGES.AUTH}?redirect=${encodeURIComponent(pathname)}`);
  }

  // in case of a livestream outside of the livestream page component, like embed
  useFetchLiveStatus(isLivestreamClaim && !livestreamPage ? channelClaimId : undefined, doFetchChannelLiveStatus);

  const thumbnail = useGetPoster(claimThumbnail);

  function getActionType() {
    if (fiatRequired) {
      if (isFetchingPurchases) {
        return '';
      } else if (!fiatPaid && !claimIsMine) {
        return channelClaimId ? 'paid_overlay' : '';
      } else {
        return 'default_button';
      }
    } else if (!contentUnlocked) {
      return 'membership_overlay';
    } else {
      return 'default_button';
    }
  }

  function handleClick() {
    if (isLiveComment || (embedded && !isPlayable)) {
      const formattedUrl = formatLbryUrlForWeb(uri);
      history.push({ pathname: formattedUrl, state: isLiveComment ? { overrideFloating: true } : undefined });
    } else {
      viewFile();

      // In case of inline player where play button is reachable -> set is expanded
      if (setExpanded && disableExpanded) {
        setExpanded(true);
        disableExpanded(true);
      }
    }
  }

  // Wrap this in useCallback because we need to use it to the view effect
  // If we don't a new instance will be created for every render and react will think the dependencies have changed, which will add/remove the listener for every render
  const viewFile = React.useCallback(() => {
    const playingOptions: PlayingUri = {
      uri,
      collection: { collectionId },
      location: { pathname, search },
      source: undefined,
      sourceId: claimLinkId,
      commentId: undefined,
    };

    if (parentCommentId) {
      playingOptions.source = 'comment';
      playingOptions.commentId = parentCommentId;
    } else if (isMarkdownPost) {
      playingOptions.source = 'markdown';
    }

    doUriInitiatePlay(playingOptions, isPlayable);
  }, [
    claimLinkId,
    collectionId,
    doUriInitiatePlay,
    isMarkdownPost,
    isPlayable,
    parentCommentId,
    pathname,
    search,
    uri,
  ]);

  React.useEffect(() => {
    // avoid selecting 'video' anymore -> can cause conflicts with Ad popup videos
    const videoOnPage = document.querySelector('.vjs-tech');

    if (
      (canViewFile || forceAutoplayParam) &&
      ((shouldAutoplay && (!videoOnPage || forceAutoplayParam) && isPlayable) ||
        (!embedded && RENDER_MODES.AUTO_RENDER_MODES.includes(renderMode)))
    ) {
      viewFile();
    }
  }, [canViewFile, embedded, forceAutoplayParam, isPlayable, renderMode, shouldAutoplay, viewFile]);

  /*
  once content is playing, let the appropriate <FileRender> take care of it...
  but for playables, always render so area can be used to fill with floating player
   */
  if (isPlaying && !isPlayable && canViewFile && !collectionId) {
    return null;
  }

  return (
    <div
      onClick={disabled ? undefined : shouldRedirect ? doAuthRedirect : handleClick}
      style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={
        embedded
          ? 'embed__inline-button'
          : classnames('content__cover', {
              'content__cover--disabled': disabled,
              'content__cover--theater-mode': theaterMode && !isMobile,
              'card__media--nsfw': obscurePreview,
            })
      }
    >
      {embedded && <FileViewerEmbeddedTitle uri={uri} isInApp />}

      {renderUnsupported ? (
        <Nag
          type="helpful"
          inline
          message={__('This content requires LBRY Desktop to display.')}
          actionText={__('Get the App')}
          href="https://lbry.com/get"
        />
      ) : (
        !sdkPaid &&
        insufficientCredits && (
          <Nag
            type="helpful"
            inline
            message={__('You need more Credits to purchase this.')}
            actionText={__('Open Rewards')}
            onClick={() => history.push(`/$/${PAGES.REWARDS}`)}
          />
        )
      )}

      {action === 'paid_overlay' ? (
        <PaidContentOverlay uri={uri} />
      ) : action === 'membership_overlay' ? (
        <>{/* Should bring membership overlay here instead of as a peer */}</>
      ) : action === 'default_button' ? (
        <>
          {(!disabled || (embedded && isLivestreamClaim)) && (
            <Button
              requiresAuth={shouldRedirect}
              onClick={handleClick}
              iconSize={30}
              title={isPlayable ? __('Play') : __('View')}
              className={classnames('button--icon', {
                'button--play': isPlayable,
                'button--view': !isPlayable,
              })}
            />
          )}
        </>
      ) : null}

      {customAction}
    </div>
  );
}
