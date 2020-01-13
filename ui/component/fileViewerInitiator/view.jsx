// @flow
// This component is entirely for triggering the start of a file view
// The actual viewer for a file exists in TextViewer and FloatingViewer
// They can't exist in one component because we need to handle/listen for the start of a new file view
// while a file is currently being viewed
import React, { useEffect, useCallback } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import isUserTyping from 'util/detect-typing';
import Yrbl from 'component/yrbl';
import I18nMessage from 'component/i18nMessage';

const SPACE_BAR_KEYCODE = 32;

type Props = {
  play: string => void,
  mediaType: string,
  isText: boolean,
  contentType: string,
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
  isAutoPlayable: boolean,
  inline: boolean,
  claim: StreamClaim,
};

export default function FileViewerInitiator(props: Props) {
  const {
    play,
    mediaType,
    isText,
    contentType,
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
    isAutoPlayable,
    claim,
  } = props;
  const cost = costInfo && costInfo.cost;
  const forceVideo = ['application/x-ext-mkv', 'video/x-matroska'].includes(contentType);
  const isPlayable = ['audio', 'video'].includes(mediaType) || forceVideo;
  const fileStatus = fileInfo && fileInfo.status;
  const webStreamOnly = contentType === 'application/pdf' || mediaType === 'text';
  const supported = IS_WEB ? (!cost && isStreamable) || webStreamOnly || forceVideo : true;
  const { name, claim_id: claimId, value } = claim;
  const fileName = value && value.source && value.source.name;
  const downloadUrl = `/$/download/${name}/${claimId}`;

  function getTitle() {
    let message = __('Unsupported File');
    // @if TARGET='web'
    if (cost) {
      message = __('Paid Content Not Supported on lbry.tv');
    } else {
      message = __("We're not quite ready to display this file on lbry.tv yet");
    }
    // @endif

    return message;
  }

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
    if (((autoplay && !videoOnPage && isAutoPlayable) || isText) && hasCostInfo && cost === 0) {
      viewFile();
    }
  }, [autoplay, viewFile, isAutoPlayable, hasCostInfo, cost, isText]);

  return (
    <div
      disabled={!hasCostInfo}
      style={!obscurePreview && supported && thumbnail && !isPlaying ? { backgroundImage: `url("${thumbnail}")` } : {}}
      onClick={supported ? viewFile : undefined}
      className={classnames({
        content__cover: supported,
        'content__cover--disabled': !supported,
        'content__cover--hidden-for-text': isText,
        'card__media--nsfw': obscurePreview,
        'card__media--disabled': supported && !fileInfo && insufficientCredits,
      })}
    >
      {!supported && (
        <Yrbl
          type="happy"
          title={getTitle()}
          subtitle={
            <I18nMessage
              tokens={{
                download_the_app: <Button button="link" label={__('download the app')} href="https://lbry.com/get" />,
                download_this_file: (
                  <Button button="link" label={__('download this file')} download={fileName} href={downloadUrl} />
                ),
              }}
            >
              Good news, though! You can %download_the_app% and gain access to everything, or %download_this_file% and
              view it on your device.
            </I18nMessage>
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
