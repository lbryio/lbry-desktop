// @flow
import { SITE_NAME } from 'config';
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import { regexInvalidURI } from 'lbry-redux';
import PostEditor from 'component/postEditor';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import Spinner from 'component/spinner';
import I18nMessage from 'component/i18nMessage';
import usePersistedState from 'effects/use-persisted-state';
import * as PUBLISH_MODES from 'constants/publish_types';
import PublishName from 'component/publishName';

type Props = {
  uri: ?string,
  mode: ?string,
  name: ?string,
  title: ?string,
  filePath: string | WebFile,
  fileMimeType: ?string,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
  publishing: boolean,
  showToast: (string) => void,
  inProgress: boolean,
  clearPublish: () => void,
  ffmpegStatus: any,
  optimize: boolean,
  size: number,
  duration: number,
  isVid: boolean,
  setPublishMode: (string) => void,
  setPrevFileText: (string) => void,
  header: Node,
};

function PublishFile(props: Props) {
  const {
    uri,
    mode,
    name,
    title,
    balance,
    filePath,
    fileMimeType,
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
    setPublishMode,
    setPrevFileText,
    header,
  } = props;

  const ffmpegAvail = ffmpegStatus.available;
  const [oversized, setOversized] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileType, setCurrentFileType] = useState(null);
  const [optimizeAvail, setOptimizeAvail] = useState(false);
  const [userOptimize, setUserOptimize] = usePersistedState('publish-file-user-optimize', false);

  const RECOMMENDED_BITRATE = 6000000;
  const TV_PUBLISH_SIZE_LIMIT: number = 4294967296;
  const TV_PUBLISH_SIZE_LIMIT_STR_GB = '4';
  const UPLOAD_SIZE_MESSAGE = __(
    '%SITE_NAME% uploads are limited to %limit% GB. Download the app for unrestricted publishing.',
    { SITE_NAME, limit: TV_PUBLISH_SIZE_LIMIT_STR_GB }
  );
  const PROCESSING_MB_PER_SECOND = 0.5;
  const MINUTES_THRESHOLD = 30;
  const HOURS_THRESHOLD = MINUTES_THRESHOLD * 60;
  const MARKDOWN_FILE_EXTENSIONS = ['txt', 'md', 'markdown'];

  const sizeInMB = Number(size) / 1000000;
  const secondsToProcess = sizeInMB / PROCESSING_MB_PER_SECOND;

  // Reset filePath if publish mode changed
  useEffect(() => {
    if (mode === PUBLISH_MODES.POST) {
      if (currentFileType !== 'text/markdown' && !isStillEditing) {
        updatePublishForm({ filePath: '' });
      }
    }
  }, [currentFileType, mode, isStillEditing, updatePublishForm]);

  useEffect(() => {
    if (!filePath || filePath === '') {
      setCurrentFile('');
      setOversized(false);
      updateFileInfo(0, 0, false);
    } else if (typeof filePath !== 'string') {
      // Update currentFile file
      if (filePath.name !== currentFile && filePath.path !== currentFile) {
        handleFileChange(filePath);
      }
    }
  }, [filePath, currentFile, handleFileChange, updateFileInfo]);

  useEffect(() => {
    const isOptimizeAvail = currentFile && currentFile !== '' && isVid && ffmpegAvail;
    const finalOptimizeState = isOptimizeAvail && userOptimize;

    setOptimizeAvail(isOptimizeAvail);
    updatePublishForm({ optimize: finalOptimizeState });
  }, [currentFile, filePath, isVid, ffmpegAvail, userOptimize, updatePublishForm]);

  function updateFileInfo(duration, size, isvid) {
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
      if (secondsToProcess > 1) return __('seconds');
      return __('second');
    } else if (s >= MINUTES_THRESHOLD && s < HOURS_THRESHOLD) {
      if (Math.floor(secondsToProcess / 60) > 1) return __('minutes');
      return __('minute');
    } else {
      if (Math.floor(secondsToProcess / 3600) > 1) return __('hours');
      return __('hour');
    }
  }

  function getMessage() {
    // @if TARGET='web'
    if (oversized) {
      return (
        <p className="help--error">
          {UPLOAD_SIZE_MESSAGE}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }
    // @endif
    if (isVid && duration && getBitrate(size, duration) > RECOMMENDED_BITRATE) {
      return (
        <p className="help--warning">
          {__('Your video has a bitrate over 5 Mbps. We suggest transcoding to provide viewers the best experience.')}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }

    if (isVid && !duration) {
      return (
        <p className="help--warning">
          {__(
            'Your video may not be the best format. Use MP4s in H264/AAC format and a friendly bitrate (under 5 Mbps) and resolution (720p) for more reliable streaming.'
          )}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://lbry.com/faq/video-publishing-guide" />
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
            'For video content, use MP4s in H264/AAC format and a friendly bitrate (under 5 Mbps) and resolution (720p) for more reliable streaming. %SITE_NAME% uploads are restricted to %limit% GB.',
            { SITE_NAME, limit: TV_PUBLISH_SIZE_LIMIT_STR_GB }
          )}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://lbry.com/faq/video-publishing-guide" />
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
          <Button button="link" label={__('Upload Guide')} href="https://lbry.com/faq/video-publishing-guide" />
        </p>
      );
    }
    // @endif
  }

  function parseName(newName) {
    let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
    return newName.replace(INVALID_URI_CHARS, '-');
  }

  function handleTitleChange(event) {
    const title = event.target.value;
    // Update title
    updatePublishForm({ title });
  }

  function handleFileReaderLoaded(event: ProgressEvent) {
    // See: https://github.com/facebook/flow/issues/3470
    if (event.target instanceof FileReader) {
      const text = event.target.result;
      updatePublishForm({ fileText: text });
      setPublishMode(PUBLISH_MODES.POST);
    }
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
    const contentType = file.type && file.type.split('/');
    const isVideo = contentType && contentType[0] === 'video';
    const isMp4 = contentType && contentType[1] === 'mp4';

    let isTextPost = false;

    if (contentType && contentType[0] === 'text') {
      isTextPost = contentType[1] === 'plain' || contentType[1] === 'markdown';
      setCurrentFileType(contentType);
    } else if (file.name) {
      // If user's machine is missign a valid content type registration
      // for markdown content: text/markdown, file extension will be used instead
      const extension = file.name.split('.').pop();
      isTextPost = MARKDOWN_FILE_EXTENSIONS.includes(extension);
    }

    if (isVideo) {
      if (isMp4) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          updateFileInfo(video.duration, file.size, isVideo);
          window.URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
          updateFileInfo(0, file.size, isVideo);
        };
        video.src = window.URL.createObjectURL(file);
      } else {
        updateFileInfo(0, file.size, isVideo);
      }
    } else {
      updateFileInfo(0, file.size, isVideo);
    }

    if (isTextPost) {
      // Create reader
      const reader = new FileReader();
      // Handler for file reader
      reader.addEventListener('load', handleFileReaderLoaded);
      // Read file contents
      reader.readAsText(file);
      setCurrentFileType('text/markdown');
    } else {
      setPublishMode(PUBLISH_MODES.FILE);
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
    let fileName = name || (file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || '';

    if (!isStillEditing) {
      publishFormParams.name = parseName(fileName);
    }

    // File path is not supported on web for security reasons so we use the name instead.
    setCurrentFile(file.path || file.name);
    updatePublishForm(publishFormParams);
  }

  const isPublishFile = mode === PUBLISH_MODES.FILE;
  const isPublishPost = mode === PUBLISH_MODES.POST;

  return (
    <Card
      className={disabled || balance === 0 ? 'card--disabled' : ''}
      title={
        <div>
          {header}
          {publishing && <Spinner type={'small'} />}
          {inProgress && (
            <div>
              <Button button="close" label={__('New')} icon={ICONS.REFRESH} onClick={clearPublish} />
            </div>
          )}
        </div>
      }
      subtitle={isStillEditing && __('You are currently editing your upload.')}
      actions={
        <React.Fragment>
          <PublishName uri={uri} />

          <FormField
            type="text"
            name="content_title"
            label={__('Title')}
            placeholder={__('Descriptive titles work best')}
            disabled={disabled}
            value={title}
            onChange={handleTitleChange}
          />
          {isPublishFile && (
            <FileSelector
              label={__('Video file')}
              disabled={disabled}
              currentPath={currentFile}
              onFileChosen={handleFileChange}
              // https://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
              accept="video/mp4,video/x-m4v,video/*"
              placeholder={__('Select video file to upload')}
            />
          )}
          {isPublishFile && getMessage()}

          {isPublishPost && (
            <PostEditor
              label={__('Post --[noun, markdown post tab button]--')}
              uri={uri}
              disabled={disabled}
              fileMimeType={fileMimeType}
              setPrevFileText={setPrevFileText}
              setCurrentFileType={setCurrentFileType}
            />
          )}

          {/* @if TARGET='app' */}
          {isPublishFile && (
            <FormField
              type="checkbox"
              checked={userOptimize}
              disabled={!optimizeAvail}
              onChange={() => setUserOptimize(!userOptimize)}
              label={__('Optimize and transcode video')}
              name="optimize"
            />
          )}
          {isPublishFile && !ffmpegAvail && (
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
          {isPublishFile && Boolean(size) && ffmpegAvail && optimize && isVid && (
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
