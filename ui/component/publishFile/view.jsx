// @flow
import { SITE_NAME, WEB_PUBLISH_SIZE_LIMIT_GB, SIMPLE_SITE } from 'config';
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import { regexInvalidURI } from 'util/lbryURI';
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
import CopyableText from 'component/copyableText';
import Empty from 'component/common/empty';
import moment from 'moment';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';
import { SOURCE_NONE, SOURCE_SELECT, SOURCE_UPLOAD } from 'constants/publish_sources';

type Props = {
  uri: ?string,
  mode: ?string,
  name: ?string,
  title: ?string,
  filePath: string | WebFile,
  fileMimeType: ?string,
  isStillEditing: boolean,
  balance: number,
  doUpdatePublishForm: ({}) => void,
  disabled: boolean,
  publishing: boolean,
  doToast: ({ message: string, isError?: boolean }) => void,
  inProgress: boolean,
  doClearPublish: () => void,
  ffmpegStatus: any,
  optimize: boolean,
  size: number,
  duration: number,
  isVid: boolean,
  subtitle: string,
  setPublishMode: (string) => void,
  setPrevFileText: (string) => void,
  header: Node,
  livestreamData: LivestreamReplayData,
  isLivestreamClaim: boolean,
  checkLivestreams: (string, string) => void,
  channelName: string,
  channelId: string,
  isCheckingLivestreams: boolean,
  setWaitForFile: (boolean) => void,
  setOverMaxBitrate: (boolean) => void,
  fileSource: string,
  changeFileSource: (string) => void,
  inEditMode: boolean,
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
    doUpdatePublishForm: updatePublishForm,
    doToast,
    disabled,
    publishing,
    inProgress,
    doClearPublish,
    optimize,
    ffmpegStatus = {},
    size,
    duration,
    isVid,
    setPublishMode,
    setPrevFileText,
    header,
    livestreamData,
    isLivestreamClaim,
    subtitle,
    checkLivestreams,
    channelId,
    channelName,
    isCheckingLivestreams,
    setWaitForFile,
    setOverMaxBitrate,
    fileSource,
    changeFileSource,
    inEditMode,
  } = props;

  const RECOMMENDED_BITRATE = 8500000;
  const MAX_BITRATE = 16500000;
  const TV_PUBLISH_SIZE_LIMIT_BYTES = WEB_PUBLISH_SIZE_LIMIT_GB * 1073741824;
  const TV_PUBLISH_SIZE_LIMIT_GB_STR = String(WEB_PUBLISH_SIZE_LIMIT_GB);

  const PROCESSING_MB_PER_SECOND = 0.5;
  const MINUTES_THRESHOLD = 30;
  const HOURS_THRESHOLD = MINUTES_THRESHOLD * 60;
  const MARKDOWN_FILE_EXTENSIONS = ['txt', 'md', 'markdown'];
  const sizeInMB = Number(size) / 1000000;
  const secondsToProcess = sizeInMB / PROCESSING_MB_PER_SECOND;
  const ffmpegAvail = ffmpegStatus.available;
  const [oversized, setOversized] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileType, setCurrentFileType] = useState(null);
  const [optimizeAvail, setOptimizeAvail] = useState(false);
  const [userOptimize, setUserOptimize] = usePersistedState('publish-file-user-optimize', false);
  const UPLOAD_SIZE_MESSAGE = __('%SITE_NAME% uploads are limited to %limit% GB.', {
    SITE_NAME,
    limit: TV_PUBLISH_SIZE_LIMIT_GB_STR,
  });

  const bitRate = getBitrate(size, duration);
  const bitRateIsOverMax = bitRate > MAX_BITRATE;

  const fileSelectorModes = [
    { label: __('Upload'), actionName: SOURCE_UPLOAD, icon: ICONS.PUBLISH },
    { label: __('Choose Replay'), actionName: SOURCE_SELECT, icon: ICONS.MENU },
    { label: isLivestreamClaim ? __('Edit / Update') : __('None'), actionName: SOURCE_NONE },
  ];

  const livestreamDataStr = JSON.stringify(livestreamData);
  const hasLivestreamData = livestreamData && Boolean(livestreamData.length);

  const [showSourceSelector, setShowSourceSelector] = useState(false);
  // const [showFileUpdate, setShowFileUpdate] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const PAGE_SIZE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages =
    hasLivestreamData && livestreamData.length > PAGE_SIZE ? Math.ceil(livestreamData.length / PAGE_SIZE) : 1;

  // Reset filePath if publish mode changed
  useEffect(() => {
    if (mode === PUBLISH_MODES.POST) {
      if (currentFileType !== 'text/markdown' && !isStillEditing) {
        updatePublishForm({ filePath: '' });
      }
    } else if (mode === PUBLISH_MODES.LIVESTREAM) {
      updatePublishForm({ filePath: '' });
    }
  }, [currentFileType, mode, isStillEditing, updatePublishForm]);

  // Reset title when form gets cleared

  useEffect(() => {
    updatePublishForm({ title: title });
  }, [filePath]);

  // Initialize default file source state for each mode.
  useEffect(() => {
    setShowSourceSelector(false);
    switch (mode) {
      case PUBLISH_MODES.LIVESTREAM:
        if (inEditMode) {
          changeFileSource(SOURCE_SELECT);
          setShowSourceSelector(true);
        } else {
          changeFileSource(SOURCE_NONE);
        }
        break;
      case PUBLISH_MODES.POST:
        changeFileSource(SOURCE_NONE);
        break;
      case PUBLISH_MODES.FILE:
        if (hasLivestreamData) setShowSourceSelector(true);
        changeFileSource(SOURCE_UPLOAD);
        break;
      default:
        changeFileSource(SOURCE_UPLOAD);
    }
  }, [mode, hasLivestreamData]); // eslint-disable-line react-hooks/exhaustive-deps

  const normalizeUrlForProtocol = (url) => {
    if (url.startsWith('https://')) {
      return url;
    } else {
      if (url.startsWith('http://')) {
        return url;
      } else if (url) {
        return `https://${url}`;
      } else return __('Click Check for Replays to update...');
    }
  };
  // update remoteUrl when replay selected
  useEffect(() => {
    const livestreamData = JSON.parse(livestreamDataStr);
    if (selectedFileIndex !== null && livestreamData && livestreamData.length) {
      updatePublishForm({
        remoteFileUrl: normalizeUrlForProtocol(livestreamData[selectedFileIndex].data.fileLocation),
      });
    }
  }, [selectedFileIndex, updatePublishForm, livestreamDataStr]);

  useEffect(() => {
    if (!filePath || filePath === '') {
      setCurrentFile('');
      setOversized(false);
      setOverMaxBitrate(false);
      updateFileInfo(0, 0, false);
    } else if (typeof filePath !== 'string') {
      // Update currentFile file
      if (filePath.name !== currentFile && filePath.path !== currentFile) {
        handleFileChange(filePath);
      }
    }
  }, [filePath, currentFile, doToast, updatePublishForm]);

  useEffect(() => {
    const isOptimizeAvail = currentFile && currentFile !== '' && isVid && ffmpegAvail;
    const finalOptimizeState = isOptimizeAvail && userOptimize;

    setOptimizeAvail(isOptimizeAvail);
    updatePublishForm({ optimize: finalOptimizeState });
  }, [currentFile, filePath, isVid, ffmpegAvail, userOptimize, updatePublishForm]);

  useEffect(() => {
    setOverMaxBitrate(bitRateIsOverMax);
  }, [bitRateIsOverMax]);

  function updateFileInfo(duration, size, isvid) {
    updatePublishForm({ fileDur: duration, fileSize: size, fileVid: isvid });
  }

  function handlePaginateReplays(page) {
    setCurrentPage(page);
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

  function getUploadMessage() {
    // @if TARGET='web'
    if (oversized) {
      return (
        <p className="help--error">
          {UPLOAD_SIZE_MESSAGE}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://odysee.com/@OdyseeHelp:b/uploadguide:1" />
        </p>
      );
    }
    // @endif

    if (isVid && duration && bitRate > RECOMMENDED_BITRATE) {
      return (
        <p className="help--warning">
          {bitRateIsOverMax
            ? __(
                'Your video has a bitrate over ~16 Mbps and cannot be processed at this time. We suggest transcoding to provide viewers the best experience.'
              )
            : __(
                'Your video has a bitrate over 8 Mbps. We suggest transcoding to provide viewers the best experience.'
              )}{' '}
          <Button
            button="link"
            label={__('Upload Guide')}
            href="https://odysee.com/@OdyseeHelp:b/uploadguide:1?lc=e280f6e6fdec3f5fd4043954c71add50b3fd2d6a9f3ddba979b459da6ae4a1f4"
          />
        </p>
      );
    }

    if (isVid && !duration) {
      return (
        <p className="help--warning">
          {__(
            'Your video may not be the best format. Use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps) for more reliable streaming.'
          )}{' '}
          <Button
            button="link"
            label={__('Upload Guide')}
            href="https://odysee.com/@OdyseeHelp:b/uploadguide:1?lc=e280f6e6fdec3f5fd4043954c71add50b3fd2d6a9f3ddba979b459da6ae4a1f4"
          />
        </p>
      );
    }

    if (!!isStillEditing && name) {
      if (isLivestreamClaim) {
        return (
          <p className="help">{__('You can upload your own recording or select a replay when your stream is over')}</p>
        );
      }
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
            'For video content, use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps) for more reliable streaming. %SITE_NAME% uploads are restricted to %limit% GB.',
            { SITE_NAME, limit: TV_PUBLISH_SIZE_LIMIT_GB_STR }
          )}{' '}
          <Button
            button="link"
            label={__('Upload Guide')}
            href="https://odysee.com/@OdyseeHelp:b/uploadguide:1?lc=e280f6e6fdec3f5fd4043954c71add50b3fd2d6a9f3ddba979b459da6ae4a1f4"
          />
        </p>
      );
    }
    // @endif
  }

  function parseName(newName) {
    let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
    return newName.replace(INVALID_URI_CHARS, '-');
  }

  function handleFileSource(source) {
    if (source === SOURCE_NONE) {
      // clear files and remotes...
      // https://github.com/lbryio/lbry-desktop/issues/5855
      // publish is trying to use one field to share html file blob and string and such
      // $FlowFixMe
      handleFileChange(false, false);
      updatePublishForm({ remoteFileUrl: undefined });
    } else if (source === SOURCE_UPLOAD) {
      updatePublishForm({ remoteFileUrl: undefined });
    } else if (source === SOURCE_SELECT) {
      // $FlowFixMe
      handleFileChange(false, false);
      if (selectedFileIndex !== null) {
        updatePublishForm({ remoteFileUrl: livestreamData[selectedFileIndex].data.fileLocation });
      }
    }
    changeFileSource(source);
    setWaitForFile(source !== SOURCE_NONE);
  }

  function handleTitleChange(event) {
    updatePublishForm({ title: event.target.value });
  }

  function handleFileReaderLoaded(event: ProgressEvent) {
    // See: https://github.com/facebook/flow/issues/3470
    if (event.target instanceof FileReader) {
      const text = event.target.result;
      updatePublishForm({ fileText: text });
      setPublishMode(PUBLISH_MODES.POST);
    }
  }

  function handleFileChange(file: WebFile, clearName = true) {
    window.URL = window.URL || window.webkitURL;
    setOversized(false);
    setOverMaxBitrate(false);

    // select file, start to select a new one, then cancel
    if (!file) {
      if (isStillEditing || !clearName) {
        updatePublishForm({ filePath: '' });
      } else {
        updatePublishForm({ filePath: '', name: '' });
      }
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

    // Strip off extention and replace invalid characters
    let fileName = name || (file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || '';
    autofillTitle(file);

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
    if (file.size && Number(file.size) > TV_PUBLISH_SIZE_LIMIT_BYTES) {
      setOversized(true);
      doToast({ message: __(UPLOAD_SIZE_MESSAGE), isError: true });
      updatePublishForm({ filePath: '' });
      return;
    }
    // @endif

    const publishFormParams: { filePath: string | WebFile, name?: string, optimize?: boolean } = {
      // if electron, we'll set filePath to the path string because SDK is handling publishing.
      // File.path will be undefined from web due to browser security, so it will default to the File Object.
      filePath: file.path || file,
    };

    if (!isStillEditing) {
      publishFormParams.name = parseName(fileName);
    }

    // File path is not supported on web for security reasons so we use the name instead.
    setCurrentFile(file.path || file.name);
    updatePublishForm(publishFormParams);
  }

  function autofillTitle(file) {
    const newTitle = (file && file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || name || '';
    if (!title) updatePublishForm({ title: newTitle });
  }

  const showFileUpload = mode === PUBLISH_MODES.FILE || PUBLISH_MODES.LIVESTREAM;
  const isPublishPost = mode === PUBLISH_MODES.POST;

  return (
    <Card
      className={classnames({
        'card--disabled': disabled || balance === 0,
      })}
      title={
        <div>
          {header} {/* display mode buttons from parent */}
          {publishing && <Spinner type={'small'} />}
          {inProgress && (
            <div>
              <Button
                button="alt"
                label={__('Clear --[clears Publish Form]--')}
                icon={ICONS.REFRESH}
                onClick={doClearPublish}
              />
            </div>
          )}
        </div>
      }
      subtitle={subtitle || (isStillEditing && __('You are currently editing your upload.'))}
      actions={
        <>
          {/* <h2 className="card__title">{__('File')}</h2> */}
          <div className="card--file">
            <React.Fragment>
              {/* Decide whether to show file upload or replay selector */}
              {/* @if TARGET='web' */}
              <>
                {showSourceSelector && (
                  <fieldset-section>
                    <div className="section__actions--between section__actions--align-bottom">
                      <div>
                        <label>{__('Replay video available')}</label>
                        <div className="button-group">
                          {fileSelectorModes.map((fmode) => (
                            <Button
                              key={fmode.label}
                              icon={fmode.icon || undefined}
                              iconSize={18}
                              label={fmode.label}
                              button="alt"
                              onClick={() => {
                                // $FlowFixMe
                                handleFileSource(fmode.actionName);
                              }}
                              className={classnames('button-toggle', {
                                'button-toggle--active': fileSource === fmode.actionName,
                              })}
                            />
                          ))}
                        </div>
                      </div>
                      {fileSource === SOURCE_SELECT && (
                        <Button
                          button="secondary"
                          label={__('Check for Replays')}
                          disabled={isCheckingLivestreams}
                          icon={ICONS.REFRESH}
                          onClick={() => checkLivestreams(channelId, channelName)}
                        />
                      )}
                    </div>
                  </fieldset-section>
                )}

                {fileSource === SOURCE_UPLOAD && showFileUpload && (
                  <>
                    <FileSelector
                      disabled={disabled}
                      currentPath={currentFile}
                      onFileChosen={handleFileChange}
                      // https://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
                      accept={SIMPLE_SITE ? 'video/mp4,video/x-m4v,video/*,audio/*' : undefined}
                      placeholder={
                        SIMPLE_SITE ? __('Select video or audio file to upload') : __('Select a file to upload')
                      }
                    />
                    {getUploadMessage()}
                  </>
                )}
                {fileSource === SOURCE_SELECT && showFileUpload && hasLivestreamData && !isCheckingLivestreams && (
                  <>
                    <fieldset-section>
                      <label>{__('Select Replay')}</label>
                      <div className="table__wrapper">
                        <table className="table table--livestream-data">
                          <tbody>
                            {livestreamData
                              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                              .map((item, i) => (
                                <tr
                                  onClick={() => setSelectedFileIndex((currentPage - 1) * PAGE_SIZE + i)}
                                  key={item.id}
                                  className={classnames('livestream__data-row', {
                                    'livestream__data-row--selected':
                                      selectedFileIndex === (currentPage - 1) * PAGE_SIZE + i,
                                  })}
                                >
                                  <td>
                                    <FormField
                                      type="radio"
                                      checked={selectedFileIndex === (currentPage - 1) * PAGE_SIZE + i}
                                      label={null}
                                      onClick={() => setSelectedFileIndex((currentPage - 1) * PAGE_SIZE + i)}
                                      className="livestream__data-row-radio"
                                    />
                                  </td>
                                  <td>
                                    <div className="livestream_thumb_container">
                                      {item.data.thumbnails.slice(0, 3).map((thumb) => (
                                        <img key={thumb} className="livestream___thumb" src={thumb} />
                                      ))}
                                    </div>
                                  </td>
                                  <td>
                                    {item.data.fileDuration && isNaN(item.data.fileDuration)
                                      ? item.data.fileDuration
                                      : `${Math.floor(item.data.fileDuration / 60)} ${
                                          Math.floor(item.data.fileDuration / 60) > 1 ? __('minutes') : __('minute')
                                        }`}
                                    <div className="table__item-label">
                                      {`${moment(item.data.uploadedAt).from(moment())}`}
                                    </div>
                                  </td>
                                  <td>
                                    <CopyableText
                                      primaryButton
                                      copyable={normalizeUrlForProtocol(item.data.fileLocation)}
                                      snackMessage={__('Url copied.')}
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </fieldset-section>
                    <fieldset-group class="fieldset-group--smushed fieldgroup--paginate">
                      <fieldset-section>
                        <ReactPaginate
                          pageCount={totalPages}
                          pageRangeDisplayed={2}
                          previousLabel="‹"
                          nextLabel="›"
                          activeClassName="pagination__item--selected"
                          pageClassName="pagination__item"
                          previousClassName="pagination__item pagination__item--previous"
                          nextClassName="pagination__item pagination__item--next"
                          breakClassName="pagination__item pagination__item--break"
                          marginPagesDisplayed={2}
                          onPageChange={(e) => handlePaginateReplays(e.selected + 1)}
                          forcePage={currentPage - 1}
                          initialPage={currentPage - 1}
                          containerClassName="pagination"
                        />
                      </fieldset-section>
                    </fieldset-group>
                  </>
                )}
                {fileSource === SOURCE_SELECT && showFileUpload && !hasLivestreamData && !isCheckingLivestreams && (
                  <div className="main--empty empty">
                    <Empty text={__('No replays found.')} />
                  </div>
                )}
                {fileSource === SOURCE_SELECT && showFileUpload && isCheckingLivestreams && (
                  <div className="main--empty empty">
                    <Spinner small />
                  </div>
                )}
              </>
              <FormField
                type="text"
                name="content_title"
                label={__('Title')}
                placeholder={__('Descriptive titles work best')}
                disabled={disabled}
                value={title}
                onChange={handleTitleChange}
                className="fieldset-group"
              />
              <PublishName uri={uri} />

              {/* @endif */}
              {/* @if TARGET='app' */}
              {showFileUpload && (
                <FileSelector
                  label={__('File')}
                  disabled={disabled}
                  currentPath={currentFile}
                  onFileChosen={handleFileChange}
                  // https://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
                  placeholder={__('Select file to upload')}
                />
              )}
              {showFileUpload && (
                <FormField
                  type="checkbox"
                  checked={userOptimize}
                  disabled={!optimizeAvail}
                  onChange={() => setUserOptimize(!userOptimize)}
                  label={__('Optimize and transcode video')}
                  name="optimize"
                />
              )}
              {showFileUpload && !ffmpegAvail && (
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
              {showFileUpload && Boolean(size) && ffmpegAvail && optimize && isVid && (
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
            </React.Fragment>
          </div>
        </>
      }
    />
  );
}

export default PublishFile;
