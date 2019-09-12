// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in FileViewer
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import React, { useEffect, useCallback, Fragment } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import isUserTyping from 'util/detect-typing';
import Yrbl from 'component/yrbl';

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
  hasCostInfo: boolean,
  costInfo: any,
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
    hasCostInfo,
    costInfo,
  } = props;
  const cost = costInfo && costInfo.cost;
  const isPlayable = ['audio', 'video'].indexOf(mediaType) !== -1;
  const fileStatus = fileInfo && fileInfo.status;
  const supported = (IS_WEB && isStreamable) || !IS_WEB;

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
    if (autoplay && !videoOnPage && isStreamable && hasCostInfo && cost === 0) {
      viewFile();
    }
  }, [autoplay, viewFile, isStreamable, hasCostInfo, cost]);

  return (
    <div
      disabled={!hasCostInfo}
      style={!obscurePreview && supported && thumbnail ? { backgroundImage: `url("${thumbnail}")` } : {}}
      onClick={supported && viewFile}
      className={classnames({
        content__cover: supported,
        'content__cover--disabled': !supported,
        'card__media--nsfw': obscurePreview,
        'card__media--disabled': supported && !fileInfo && insufficientCredits,
      })}
    >
      {!supported && (
        <Yrbl
          type="happy"
          title={__('Unsupported File')}
          subtitle={
            <Fragment>
              <p>
                {__('Good news, though! You can')}{' '}
                <Button button="link" label={__('Download the app')} href="https://lbry.com/get" />{' '}
                {__('and gain access to everything.')}
              </p>
            </Fragment>
          }
        />
      )}
      {!isPlaying && supported && (
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
