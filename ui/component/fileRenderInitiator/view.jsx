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
import Nag from 'component/common/nag';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { LivestreamContext } from 'page/livestream/view';
import { formatLbryUrlForWeb } from 'util/url';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import useFetchLiveStatus from 'effects/use-fetch-live';
import useThumbnail from 'effects/use-thumbnail';

type Props = {
  channelClaimId: ?string,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  history: { push: (string) => void },
  location: { search: ?string, pathname: string, href: string, state: { forceAutoplay: boolean } },
  obscurePreview: boolean,
  insufficientCredits: boolean,
  claimThumbnail?: string,
  autoplay: boolean,
  costInfo: any,
  inline: boolean,
  renderMode: string,
  claimWasPurchased: boolean,
  authenticated: boolean,
  videoTheaterMode: boolean,
  isCurrentClaimLive?: boolean,
  isLivestreamClaim: boolean,
  customAction?: any,
  embedded?: boolean,
  parentCommentId?: string,
  isMarkdownPost?: boolean,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable: boolean) => void,
  doFetchChannelLiveStatus: (string) => void,
};

export default function FileRenderInitiator(props: Props) {
  const {
    channelClaimId,
    isPlaying,
    fileInfo,
    uri,
    obscurePreview,
    insufficientCredits,
    history,
    location,
    claimThumbnail,
    autoplay,
    renderMode,
    costInfo,
    claimWasPurchased,
    authenticated,
    videoTheaterMode,
    isCurrentClaimLive,
    isLivestreamClaim,
    customAction,
    embedded,
    parentCommentId,
    isMarkdownPost,
    doUriInitiatePlay,
    doFetchChannelLiveStatus,
  } = props;

  const { livestreamPage, layountRendered } = React.useContext(LivestreamContext) || {};

  const isMobile = useIsMobile();

  const containerRef = React.useRef<any>();

  const { search, href, state: locationState, pathname } = location;
  const urlParams = search && new URLSearchParams(search);
  const collectionId = urlParams && urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  // check if there is a time or autoplay parameter, if so force autoplay
  const urlTimeParam = href && href.indexOf('t=') > -1;
  const forceAutoplayParam = locationState && locationState.forceAutoplay;
  const shouldAutoplay = !embedded && (forceAutoplayParam || urlTimeParam || autoplay);

  const isFree = costInfo && costInfo.cost === 0;
  const canViewFile = isLivestreamClaim
    ? (layountRendered || isMobile) && isCurrentClaimLive
    : isFree || claimWasPurchased;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;
  const isText = RENDER_MODES.TEXT_MODES.includes(renderMode);

  const renderUnsupported = RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode);
  const disabled =
    (isLivestreamClaim && !isCurrentClaimLive) ||
    renderUnsupported ||
    (!fileInfo && insufficientCredits && !claimWasPurchased);
  const shouldRedirect = !authenticated && !isFree;

  function doAuthRedirect() {
    history.push(`/$/${PAGES.AUTH}?redirect=${encodeURIComponent(pathname)}`);
  }

  useFetchLiveStatus(livestreamPage ? undefined : channelClaimId, doFetchChannelLiveStatus);

  const thumbnail = useThumbnail(claimThumbnail, containerRef);

  function handleClick() {
    if (embedded && !isPlayable) {
      const formattedUrl = formatLbryUrlForWeb(uri);
      history.push(formattedUrl);
    } else {
      viewFile();
    }
  }

  // Wrap this in useCallback because we need to use it to the view effect
  // If we don't a new instance will be created for every render and react will think the dependencies have changed, which will add/remove the listener for every render
  const viewFile = React.useCallback(() => {
    const playingOptions = { uri, collectionId, pathname, source: undefined, commentId: undefined };

    if (parentCommentId) {
      playingOptions.source = 'comment';
      playingOptions.commentId = parentCommentId;
    } else if (isMarkdownPost) {
      playingOptions.source = 'markdown';
    }

    doUriInitiatePlay(playingOptions, isPlayable);
  }, [collectionId, doUriInitiatePlay, isMarkdownPost, isPlayable, parentCommentId, pathname, uri]);

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
      ref={containerRef}
      onClick={disabled ? undefined : shouldRedirect ? doAuthRedirect : handleClick}
      style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={
        embedded
          ? 'embed__inline-button'
          : classnames('content__cover', {
              'content__cover--disabled': disabled,
              'content__cover--theater-mode': videoTheaterMode && !isMobile,
              'content__cover--text': isText,
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
        !claimWasPurchased &&
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

      {customAction}
    </div>
  );
}
