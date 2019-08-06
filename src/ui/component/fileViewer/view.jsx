// @flow
import React, { Fragment, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';
import Button from 'component/button';
import FileRender from 'component/fileRender';
import isUserTyping from 'util/detect-typing';

const SPACE_BAR_KEYCODE = 32;

type Props = {
  play: (string, boolean) => void,
  mediaType: string,
  isLoading: boolean,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  obscurePreview: boolean,
  insufficientCredits: boolean,
  isStreamable: boolean,
  thumbnail?: string,
  streamingUrl?: string,
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
    streamingUrl,
    isStreamable,
  } = props;

  const isPlayable = ['audio', 'video'].indexOf(mediaType) !== -1;
  const fileStatus = fileInfo && fileInfo.status;
  const isReadyToPlay = (isStreamable && streamingUrl) || (fileInfo && fileInfo.completed);
  const loadingMessage =
    !isStreamable && fileInfo && fileInfo.blobs_completed >= 1 && (!fileInfo.download_path || !fileInfo.written_bytes)
      ? __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
      : __('Loading');

  // Wrap this in useCallback because we need to use it to the keyboard effect
  // If we don't a new instance will be created for every render and react will think the dependencies have change, which will add/remove the listener for every render
  const viewFile = useCallback(
    (e: SyntheticInputEvent<*> | KeyboardEvent) => {
      e.stopPropagation();

      // Check for user setting here
      const saveFile = !isStreamable;

      play(uri, saveFile);
    },
    [play, uri, isStreamable]
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

  return (
    <div
      onClick={viewFile}
      style={!obscurePreview && thumbnail ? { backgroundImage: `url("${thumbnail}")` } : {}}
      className={classnames('video content__cover content__embedded', {
        'card__media--nsfw': obscurePreview,
        'card__media--disabled': !fileInfo && insufficientCredits,
      })}
    >
      {isPlaying && (
        <Fragment>{isReadyToPlay ? <FileRender uri={uri} /> : <LoadingScreen status={loadingMessage} />}</Fragment>
      )}

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
