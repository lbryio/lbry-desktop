// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in TextViewer and FileRenderFloating
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import React, { useEffect, useCallback } from 'react';
import classnames from 'classnames';
import * as PAGES from 'constants/pages';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as KEYCODES from 'constants/keycodes';
import Button from 'component/button';
import isUserTyping from 'util/detect-typing';
import { getThumbnailCdnUrl } from 'util/thumbnail';
import Nag from 'component/common/nag';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

type Props = {
  play: (string, string, boolean) => void,
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
  claim: StreamClaim,
  claimWasPurchased: boolean,
  videoTheaterMode: boolean,
  collectionId: string,
};

export default function FileRenderInitiator(props: Props) {
  const {
    play,
    isPlaying,
    fileInfo,
    uri,
    obscurePreview,
    insufficientCredits,
    history,
    location,
    claimThumbnail,
    renderMode,
    costInfo,
    claimWasPurchased,
    videoTheaterMode,
    collectionId,
  } = props;

  // check if there is a time or autoplay parameter, if so force autoplay
  const urlTimeParam = location && location.href && location.href.indexOf('t=') > -1;
  const forceAutoplayParam = location && location.state && location.state.forceAutoplay;
  const autoplay = forceAutoplayParam || urlTimeParam || props.autoplay;

  const isFree = costInfo && costInfo.cost === 0;
  const canViewFile = isFree || claimWasPurchased;
  const fileStatus = fileInfo && fileInfo.status;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode);
  const isText = RENDER_MODES.TEXT_MODES.includes(renderMode);
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);
  const containerRef = React.useRef<any>();

  useEffect(() => {
    if (claimThumbnail) {
      setTimeout(() => {
        let newThumbnail = claimThumbnail;

        // @if TARGET='web'
        if (
          containerRef.current &&
          containerRef.current.parentElement &&
          containerRef.current.parentElement.offsetWidth
        ) {
          const w = containerRef.current.parentElement.offsetWidth;
          newThumbnail = getThumbnailCdnUrl({ thumbnail: newThumbnail, width: w, height: w });
        }
        // @endif

        if (newThumbnail !== thumbnail) {
          setThumbnail(newThumbnail);
        }
      }, 200);
    }
  }, [claimThumbnail, thumbnail]);

  // Wrap this in useCallback because we need to use it to the keyboard effect
  // If we don't a new instance will be created for every render and react will think the dependencies have changed, which will add/remove the listener for every render
  const viewFile = useCallback(
    (e?: SyntheticInputEvent<*> | KeyboardEvent) => {
      if (e) {
        e.stopPropagation();
      }

      play(uri, collectionId, isPlayable);
    },
    [play, uri, isPlayable, collectionId]
  );

  useEffect(() => {
    // This is just for beginning to download a file
    // Play/Pause/Fullscreen will be handled by the respective viewers because not every file type should behave the same
    function handleKeyDown(e: KeyboardEvent) {
      if (!isUserTyping() && e.keyCode === KEYCODES.SPACEBAR) {
        e.preventDefault();

        if (!isPlaying || fileStatus === 'stopped') {
          viewFile(e);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, fileStatus, viewFile]);

  useEffect(() => {
    const videoOnPage = document.querySelector('video');
    if (
      (canViewFile || forceAutoplayParam) &&
      ((autoplay && (!videoOnPage || forceAutoplayParam) && isPlayable) ||
        RENDER_MODES.AUTO_RENDER_MODES.includes(renderMode))
    ) {
      viewFile();
    }
  }, [autoplay, canViewFile, forceAutoplayParam, isPlayable, renderMode, viewFile]);

  /*
  once content is playing, let the appropriate <FileRender> take care of it...
  but for playables, always render so area can be used to fill with floating player
   */
  if (isPlaying && !isPlayable) {
    if (canViewFile && !collectionId) {
      return null;
    }
  }

  const disabled = !fileInfo && insufficientCredits && !claimWasPurchased;

  return (
    <div
      ref={containerRef}
      onClick={disabled ? undefined : viewFile}
      style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={classnames('content__cover', {
        'content__cover--disabled': disabled,
        'content__cover--theater-mode': videoTheaterMode,
        'content__cover--text': isText,
        'card__media--nsfw': obscurePreview,
      })}
    >
      {!claimWasPurchased && insufficientCredits && (
        <Nag
          type="helpful"
          inline
          message={__('You need more Credits to purchase this.')}
          actionText={__('Open Rewards')}
          onClick={() => history.push(`/$/${PAGES.REWARDS}`)}
        />
      )}
      {!disabled && (
        <Button
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
