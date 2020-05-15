// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import { regexInvalidURI } from 'lbry-redux';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import Spinner from 'component/spinner';
import I18nMessage from '../i18nMessage';

type Props = {
  name: ?string,
  filePath: string | WebFile,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
  publishing: boolean,
  showToast: string => void,
  inProgress: boolean,
  clearPublish: () => void,
  ffmpegStatus: any,
  optimize: boolean,
  size: number,
  duration: number,
  isVid: boolean,
};

function PublishFile(props: Props) {
  const {
    name,
    balance,
    filePath,
    isStillEditing,
    updatePublishForm,
    disabled,
    publishing,
    inProgress,
    clearPublish,
    optimize,
    ffmpegStatus = {},
    size,
    duration,
    isVid,
  } = props;

  const { available } = ffmpegStatus;
  const [oversized, setOversized] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const RECOMMENDED_BITRATE = 6000000;
  const TV_PUBLISH_SIZE_LIMIT: number = 1073741824;
  const UPLOAD_SIZE_MESSAGE = 'Lbry.tv uploads are limited to 1 GB. Download the app for unrestricted publishing.';
  const PROCESSING_MB_PER_SECOND = 0.5;
  const MINUTES_THRESHOLD = 30;
  const HOURS_THRESHOLD = MINUTES_THRESHOLD * 60;

  const sizeInMB = Number(size) / 1000000;
  const secondsToProcess = sizeInMB / PROCESSING_MB_PER_SECOND;

  // clear warnings
  useEffect(() => {
    if (!filePath || filePath === '') {
      setCurrentFile('');
      setOversized(false);
      updateOptimizeState(0, 0, false);
    } else if (typeof filePath !== 'string') {
      // Update currentFile file
      if (filePath.name !== currentFile && filePath.path !== currentFile) {
        handleFileChange(filePath);
      }
    }
  }, [filePath, currentFile, handleFileChange, updateOptimizeState]);

  function updateOptimizeState(duration, size, isvid) {
    updatePublishForm({ fileDur: duration, fileSize: size, fileVid: isvid });
  }

  function getBitrate(size, duration) {
    const s = Number(size);
    const d = Number(duration);
    if (s && d) {
      return (s * 8) / d;
    } else {
      return 0;
    }
  }

  function getTimeForMB(s) {
    if (s < MINUTES_THRESHOLD) {
      return Math.floor(secondsToProcess);
    } else if (s >= MINUTES_THRESHOLD && s < HOURS_THRESHOLD) {
      return Math.floor(secondsToProcess / 60);
    } else {
      return Math.floor(secondsToProcess / 60 / 60);
    }
  }

  function getUnitsForMB(s) {
    if (s < MINUTES_THRESHOLD) {
      if (secondsToProcess > 1) return 'seconds';
      return 'second';
    } else if (s >= MINUTES_THRESHOLD && s < HOURS_THRESHOLD) {
      if (Math.floor(secondsToProcess / 60) > 1) return 'minutes';
      return 'minute';
    } else {
      if (Math.floor(secondsToProcess / 3600) > 1) return 'hours';
      return 'hour';
    }
  }

  function getMessage() {
    // @if TARGET='web'
    if (oversized) {
      return (
        <p className="help--error">
          {__(UPLOAD_SIZE_MESSAGE)}{' '}
          <Button button="link" label={__('Publishing Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }
    // @endif
    if (isVid && duration && getBitrate(size, duration) > RECOMMENDED_BITRATE) {
      return (
        <p className="help--warning">
          {__('Your video has a bitrate over 5 Mbps. We suggest transcoding to provide viewers the best experience.')}{' '}
          <Button button="link" label={__('Publishing Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }

    if (isVid && !duration) {
      return (
        <p className="help--warning">
          {__(
            'Your video may not be the best format. Use MP4s in H264/AAC format and a friendly bitrate (under 5 Mbps) and resolution (720p) for more reliable streaming.'
          )}{' '}
          <Button button="link" label={__('Publishing Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }

    if (!!isStillEditing && name) {
      return (
        <p className="help">
          {__("If you don't choose a file, the file from your existing claim %name% will be used", { name: name })}
        </p>
      );
    }
    // @if TARGET='web'
    if (!isStillEditing) {
      return (
        <p className="help">
          {__(
            'For video content, use MP4s in H264/AAC format and a friendly bitrate (under 5 Mbps) and resolution (720p) for more reliable streaming. Lbry.tv uploads are restricted to 1 GB.'
          )}{' '}
          <Button button="link" label={__('Publishing Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }
    // @endif

    // @if TARGET='app'
    if (!isStillEditing) {
      return (
        <p className="help">
          {__(
            'For video content, use MP4s in H264/AAC format and a friendly bitrate (under 5 Mbps) and resolution (720p) for more reliable streaming.'
          )}{' '}
          <Button button="link" label={__('Publishing Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }
    // @endif
  }

  function handleFileChange(file: WebFile) {
    const { showToast } = props;
    window.URL = window.URL || window.webkitURL;
    setOversized(false);

    // select file, start to select a new one, then cancel
    if (!file) {
      updatePublishForm({ filePath: '', name: '' });
      return;
    }

    // if video, extract duration so we can warn about bitrateif (typeof file !== 'string') {
    const contentType = file.type.split('/');
    const isVideo = contentType[0] === 'video';
    const isMp4 = contentType[1] === 'mp4';
    if (isVideo) {
      if (isMp4) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          updateOptimizeState(video.duration, file.size, isVideo);
          window.URL.revokeObjectURL(video.src);
        };
        video.onerror = function() {
          updateOptimizeState(0, file.size, isVideo);
        };
        video.src = window.URL.createObjectURL(file);
      } else {
        updateOptimizeState(0, file.size, isVideo);
      }
    }

    // @if TARGET='web'
    // we only need to enforce file sizes on 'web'
    if (file.size && Number(file.size) > TV_PUBLISH_SIZE_LIMIT) {
      setOversized(true);
      showToast(__(UPLOAD_SIZE_MESSAGE));
      updatePublishForm({ filePath: '', name: '' });
      return;
    }
    // @endif

    const publishFormParams: { filePath: string | WebFile, name?: string, optimize?: boolean } = {
      // if electron, we'll set filePath to the path string because SDK is handling publishing.
      // File.path will be undefined from web due to browser security, so it will default to the File Object.
      filePath: file.path || file,
    };
    // Strip off extention and replace invalid characters
    let fileName = name || file.name.substr(0, file.name.lastIndexOf('.')) || file.name;
    let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
    let parsedFileName = fileName.replace(INVALID_URI_CHARS, '-');
    if (!isStillEditing) {
      publishFormParams.name = parsedFileName;
    }
    // File path is not supported on web for security reasons so we use the name instead.
    setCurrentFile(file.path || file.name);
    updatePublishForm(publishFormParams);
  }

  let title;
  if (publishing) {
    title = (
      <span>
        {__('Publishing')}
        <Spinner type={'small'} />
      </span>
    );
  } else {
    title = isStillEditing ? __('Edit') : __('Publish');
  }

  return (
    <Card
      icon={ICONS.PUBLISH}
      disabled={disabled || balance === 0}
      title={
        <React.Fragment>
          {title}{' '}
          {inProgress && <Button button="close" label={__('Cancel')} icon={ICONS.REMOVE} onClick={clearPublish} />}
        </React.Fragment>
      }
      subtitle={
        isStillEditing ? __('You are currently editing a claim.') : __('Publish something totally wacky and wild.')
      }
      actions={
        <React.Fragment>
          <FileSelector disabled={disabled} currentPath={currentFile} onFileChosen={handleFileChange} />
          {getMessage()}
          {/* @if TARGET='app' */}
          <FormField
            type="checkbox"
            checked={isVid && available && optimize}
            disabled={!isVid || !available}
            onChange={e => updatePublishForm({ optimize: e.target.checked })}
            label={__('Optimize and transcode video')}
            name="optimize"
          />
          {!available && (
            <p className="help">
              <I18nMessage
                tokens={{
                  settings_link: <Button button="link" navigate="/$/settings" label={__('Settings')} />,
                }}
              >
                FFmpeg not configured. More in %settings_link%.
              </I18nMessage>
            </p>
          )}
          {Boolean(size) && available && optimize && isVid && (
            <p className="help">
              <I18nMessage
                tokens={{
                  size: Math.ceil(sizeInMB),
                  processTime: getTimeForMB(sizeInMB),
                  units: getUnitsForMB(sizeInMB),
                }}
              >
                Transcoding this %size% MB file should take under %processTime% %units%.
              </I18nMessage>
            </p>
          )}
          {/* @endif */}
        </React.Fragment>
      }
    />
  );
}

export default PublishFile;
