// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in TextViewer and FileRenderFloating
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import React, { useEffect, useCallback } from 'react';
import classnames from 'classnames';
import * as PAGES from 'constants/pages';
import * as RENDER_MODES from 'constants/file_render_modes';
import Button from 'component/button';
import isUserTyping from 'util/detect-typing';
import Nag from 'component/common/nag';

const SPACE_BAR_KEYCODE = 32;

type Props = {
  play: string => void,
  isLoading: boolean,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  history: { push: string => void },
  obscurePreview: boolean,
  insufficientCredits: boolean,
  thumbnail?: string,
  autoplay: boolean,
  hasCostInfo: boolean,
  costInfo: any,
  inline: boolean,
  renderMode: string,
  claim: StreamClaim,
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
    thumbnail,
    autoplay,
    renderMode,
    hasCostInfo,
    costInfo,
  } = props;

  const cost = costInfo && costInfo.cost;
  const isFree = hasCostInfo && cost === 0;
  const fileStatus = fileInfo && fileInfo.status;
  const isPlayable = RENDER_MODES.FLOATING_MODES.includes(renderMode);

  // Wrap this in useCallback because we need to use it to the keyboard effect
  // If we don't a new instance will be created for every render and react will think the dependencies have changed, which will add/remove the listener for every render
  const viewFile = useCallback(
    (e?: SyntheticInputEvent<*> | KeyboardEvent) => {
      if (e) {
        e.stopPropagation();
      }

      play(uri);
    },
    [play, uri]
  );

  useEffect(() => {
    // This is just for beginning to download a file
    // Play/Pause/Fullscreen will be handled by the respective viewers because not every file type should behave the same
    function handleKeyDown(e: KeyboardEvent) {
      if (!isUserTyping() && e.keyCode === SPACE_BAR_KEYCODE) {
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
    if (isFree && ((autoplay && !videoOnPage && isPlayable) || RENDER_MODES.AUTO_RENDER_MODES.includes(renderMode))) {
      viewFile();
    }
  }, [autoplay, viewFile, isFree, renderMode, isPlayable]);

  /*
  once content is playing, let the appropriate <FileRender> take care of it...
  but for playables, always render so area can be used to fill with floating player
   */
  if (isPlaying && !isPlayable) {
    return null;
  }

  const showAppNag = IS_WEB && (!isFree || RENDER_MODES.UNSUPPORTED_IN_THIS_APP.includes(renderMode));

  const disabled = showAppNag || (!fileInfo && insufficientCredits);

  return (
    <div
      onClick={disabled ? undefined : viewFile}
      style={thumbnail && !obscurePreview ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={classnames('content__cover', {
        'content__cover--disabled': disabled,
        'card__media--nsfw': obscurePreview,
      })}
    >
      {showAppNag && (
        <Nag
          type="helpful"
          inline
          message={__('This content requires LBRY Desktop to display.')}
          actionText={__('Get the App')}
          href="https://lbry.com/get"
        />
      )}
      {insufficientCredits && !showAppNag && (
        <Nag
          type="helpful"
          inline
          message={__('You need more credits to purchase this.')}
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
