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
import { getThumbnailCdnUrl } from 'util/thumbnail';
import Nag from 'component/common/nag';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';
import * as COLLECTIONS_CONSTS from 'constants/collections';

type Props = {
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
  doUriInitiatePlay: (uri: string, collectionId: ?string, isPlayable: boolean) => void,
  doSetPlayingUri: ({ uri: ?string }) => void,
  doSetPrimaryUri: (uri: ?string) => void,
};

export default function FileRenderInitiator(props: Props) {
  const {
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
    doUriInitiatePlay,
    doSetPlayingUri,
    doSetPrimaryUri,
  } = props;

  const containerRef = React.useRef<any>();

  const isMobile = useIsMobile();

  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);

  const { search, href, state: locationState } = location;
  const urlParams = search && new URLSearchParams(search);
  const collectionId = urlParams && urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  // check if there is a time or autoplay parameter, if so force autoplay
  const urlTimeParam = href && href.indexOf('t=') > -1;
  const forceAutoplayParam = locationState && locationState.forceAutoplay;
  const shouldAutoplay = forceAutoplayParam || urlTimeParam || autoplay;

  const isFree = costInfo && costInfo.cost === 0;
  const canViewFile = isFree || claimWasPurchased;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode) || isCurrentClaimLive;
  const isText = RENDER_MODES.TEXT_MODES.includes(renderMode);
  const isMobileClaimLive = isMobile && isCurrentClaimLive;
  const foundCover = thumbnail !== FileRenderPlaceholder;

  const renderUnsupported = RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode);
  const disabled = renderUnsupported || (!fileInfo && insufficientCredits && !claimWasPurchased);
  const shouldRedirect = !authenticated && !isFree;

  React.useEffect(() => {
    // Set livestream as playing uri so it can be rendered by <FileRenderFloating /> on mobile
    // instead of showing an empty cover image. Needs cover to fill the space with the player.
    if (isMobileClaimLive && foundCover) {
      doSetPlayingUri({ uri });
      doSetPrimaryUri(uri);
    }
  }, [doSetPlayingUri, doSetPrimaryUri, foundCover, isMobileClaimLive, uri]);

  function doAuthRedirect() {
    history.push(`/$/${PAGES.AUTH}?redirect=${encodeURIComponent(location.pathname)}`);
  }

  React.useEffect(() => {
    if (!claimThumbnail) return;

    setTimeout(() => {
      let newThumbnail = claimThumbnail;

      if (
        containerRef.current &&
        containerRef.current.parentElement &&
        containerRef.current.parentElement.offsetWidth
      ) {
        const w = containerRef.current.parentElement.offsetWidth;
        newThumbnail = getThumbnailCdnUrl({ thumbnail: newThumbnail, width: w, height: w });
      }

      if (newThumbnail !== thumbnail) {
        setThumbnail(newThumbnail);
      }
    }, 200);
  }, [claimThumbnail, thumbnail]);

  // Wrap this in useCallback because we need to use it to the view effect
  // If we don't a new instance will be created for every render and react will think the dependencies have changed, which will add/remove the listener for every render
  const viewFile = React.useCallback(() => {
    doUriInitiatePlay(uri, collectionId, isPlayable);
  }, [collectionId, doUriInitiatePlay, isPlayable, uri]);

  React.useEffect(() => {
    const videoOnPage = document.querySelector('video');

    if (
      (canViewFile || forceAutoplayParam) &&
      ((shouldAutoplay && (!videoOnPage || forceAutoplayParam) && isPlayable) ||
        RENDER_MODES.AUTO_RENDER_MODES.includes(renderMode))
    ) {
      viewFile();
    }
  }, [canViewFile, forceAutoplayParam, isPlayable, renderMode, shouldAutoplay, viewFile]);

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
      onClick={disabled || isMobileClaimLive ? undefined : shouldRedirect ? doAuthRedirect : viewFile}
      style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={classnames('content__cover', {
        'content__cover--disabled': disabled,
        'content__cover--theater-mode': videoTheaterMode,
        'content__cover--text': isText,
        'card__media--nsfw': obscurePreview,
      })}
    >
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

      {!disabled && !isMobileClaimLive && (
        <Button
          requiresAuth={shouldRedirect}
          onClick={viewFile}
          iconSize={30}
          title={isPlayable ? __('Play') : __('View')}
          className={classnames('button--icon', {
            'button--play': isPlayable,
            'button--view': !isPlayable,
          })}
        />
      )}
    </div>
  );
}
