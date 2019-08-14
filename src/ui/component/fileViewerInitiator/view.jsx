// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in FileViewer
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import React, { useEffect, useCallback } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import isUserTyping from 'util/detect-typing';

const SPACE_BAR_KEYCODE = 32;

type Props = {
  play: string => void,
  mediaType: string,
  isLoading: boolean,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  obscurePreview: boolean,
  insufficientCredits: boolean,
  isStreamable: boolean,
  thumbnail?: string,
  autoplay: boolean,
};

export default function FileViewer(props: Props) {
  const {
    play,
    mediaType,
    isPlaying,
    fileInfo,
    uri,
    obscurePreview,
    insufficientCredits,
    thumbnail,
    autoplay,
    isStreamable,
  } = props;

  const isPlayable = ['audio', 'video'].indexOf(mediaType) !== -1;
  const fileStatus = fileInfo && fileInfo.status;

  // Wrap this in useCallback because we need to use it to the keyboard effect
  // If we don't a new instance will be created for every render and react will think the dependencies have change, which will add/remove the listener for every render
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
    if (autoplay && !videoOnPage && isStreamable) {
      viewFile();
    }
  }, [autoplay, viewFile, isStreamable]);

  return (
    <div
      onClick={viewFile}
      style={!obscurePreview && thumbnail ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={classnames('content__cover', {
        'card__media--nsfw': obscurePreview,
        'card__media--disabled': !fileInfo && insufficientCredits,
      })}
    >
      {!isPlaying && (
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
