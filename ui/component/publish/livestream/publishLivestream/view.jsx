// @flow
import { SITE_NAME, WEB_PUBLISH_SIZE_LIMIT_GB, SIMPLE_SITE } from 'config';
import { SOURCE_NONE, SOURCE_SELECT, SOURCE_UPLOAD } from 'constants/publish_sources';
import React, { useState, useEffect } from 'react';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import { regexInvalidURI } from 'util/lbryURI';
import Spinner from 'component/spinner';
import * as PUBLISH_MODES from 'constants/publish_types';
import PublishName from '../../shared/publishName';
import CopyableText from 'component/copyableText';
import Empty from 'component/common/empty';
import moment from 'moment';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import './style.scss';

type Props = {
  uri: ?string,
  mode: ?string,
  disabled: boolean,
  livestreamData: LivestreamReplayData,
  isCheckingLivestreams: boolean,
  setOverMaxBitrate: (boolean) => void,
  fileSource: string,
  changeFileSource: (string) => void,
  inEditMode: boolean,
  replaySource?: string,
  setReplaySource: (string) => void,
  // --- redux ---
  name: ?string,
  title: ?string,
  filePath: string | WebFile,
  isStillEditing: boolean,
  balance: number,
  publishing: boolean,
  size: number,
  duration: number,
  isVid: boolean,
  doUpdatePublishForm: ({}) => void,
  doToast: ({ message: string, isError?: boolean }) => void,
};

function PublishLivestream(props: Props) {
  const {
    uri,
    mode,
    name,
    title,
    balance,
    filePath,
    isStillEditing,
    doUpdatePublishForm: updatePublishForm,
    doToast,
    size,
    duration,
    isVid,
    disabled,
    livestreamData,
    isCheckingLivestreams,
    setOverMaxBitrate,
    fileSource,
    changeFileSource,
    inEditMode,
    setReplaySource,
    replaySource,
  } = props;

  const livestreamDataStr = JSON.stringify(livestreamData);
  const hasLivestreamData = livestreamData && Boolean(livestreamData.length);

  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const PAGE_SIZE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages =
    hasLivestreamData && livestreamData.length > PAGE_SIZE ? Math.ceil(livestreamData.length / PAGE_SIZE) : 1;

  const replayTitleLabel = !inEditMode ? __('Select Replay') : __('Use Replay');

  const RECOMMENDED_BITRATE = 8500000;
  const MAX_BITRATE = 16500000;
  const TV_PUBLISH_SIZE_LIMIT_BYTES = WEB_PUBLISH_SIZE_LIMIT_GB * 1073741824;
  const TV_PUBLISH_SIZE_LIMIT_GB_STR = String(WEB_PUBLISH_SIZE_LIMIT_GB);
  const bitRate = getBitrate(size, duration);
  const bitRateIsOverMax = bitRate > MAX_BITRATE;
  const [oversized, setOversized] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const UPLOAD_SIZE_MESSAGE = __('%SITE_NAME% uploads are limited to %limit% GB.', {
    SITE_NAME,
    limit: TV_PUBLISH_SIZE_LIMIT_GB_STR,
  });

  // Reset filePath if publish mode changed
  useEffect(() => {
    updatePublishForm({ filePath: '' });
  }, [mode, isStillEditing, updatePublishForm]);

  // Reset title when form gets cleared
  useEffect(() => {
    updatePublishForm({ title: title });
  }, [filePath]);

  // Initialize default file source state for each mode.
  useEffect(() => {
    switch (mode) {
      case PUBLISH_MODES.LIVESTREAM:
        if (inEditMode) {
          changeFileSource(SOURCE_SELECT);
        } else {
          changeFileSource(SOURCE_NONE);
        }
        break;
      case PUBLISH_MODES.FILE:
        changeFileSource(SOURCE_UPLOAD);
        break;
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
      if (replaySource !== 'upload') {
        updatePublishForm({
          remoteFileUrl: normalizeUrlForProtocol(livestreamData[selectedFileIndex].data.fileLocation),
          isLivestreamPublish: true,
        });
      } else {
        updatePublishForm({
          remoteFileUrl: normalizeUrlForProtocol(livestreamData[selectedFileIndex].data.fileLocation),
          isLivestreamPublish: false,
        });
      }
    }
  }, [replaySource, selectedFileIndex, updatePublishForm, livestreamDataStr]);

  function handlePaginateReplays(page) {
    setCurrentPage(page);
  }

  function handleTitleChange(event) {
    updatePublishForm({ title: event.target.value });
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
    setOverMaxBitrate(bitRateIsOverMax);
  }, [bitRateIsOverMax]);

  function updateFileInfo(duration, size, isvid) {
    updatePublishForm({ fileDur: duration, fileSize: size, fileVid: isvid });
  }

  function parseName(newName) {
    let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
    return newName.replace(INVALID_URI_CHARS, '-');
  }

  /*
  function autofillTitle(file) {
    const newTitle = (file && file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || name || '';
    if (!title) updatePublishForm({ title: newTitle });
  }
  */
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
    updatePublishForm({ isLivestreamPublish: false });

    // Strip off extention and replace invalid characters
    let fileName = name || (file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || '';

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

  function updateReplayOption(value) {
    setReplaySource(value);
    if (value !== 'choose') {
      setSelectedFileIndex(null);
    }
    if (value !== 'upload') {
      updatePublishForm({ filePath: '' });
    }
  }

  return (
    <Card
      className={classnames({
        'card--disabled': disabled || balance === 0,
      })}
      actions={
        <>
          <div className="card--file">
            <React.Fragment>
              {/* Decide whether to show file upload or replay selector */}
              {/* @if TARGET='web' */}
              <FormField
                type="text"
                name="content_title"
                label={__('Title')}
                placeholder={__('Descriptive titles work best')}
                disabled={disabled}
                value={title}
                onChange={handleTitleChange}
                className="fieldset-group"
                max="200"
                autoFocus
                autoComplete="off"
              />
              <PublishName uri={uri} />
              <>
                {inEditMode && (
                  <fieldset-section>
                    <label style={{ marginBottom: 'var(--spacing-s)' }}>
                      {inEditMode && (
                        <FormField
                          name="reuse-replay"
                          key="reuse-replay"
                          type="radio"
                          checked={replaySource === 'keep'}
                          onClick={() => updateReplayOption('keep')}
                        />
                      )}
                      {__('Update only')}
                    </label>
                  </fieldset-section>
                )}
                {(fileSource === SOURCE_SELECT || inEditMode) && hasLivestreamData && !isCheckingLivestreams && (
                  <>
                    <label>
                      {inEditMode && (
                        <FormField
                          name="show-replays"
                          key="show-replays"
                          type="radio"
                          checked={replaySource === 'choose'}
                          onClick={() => updateReplayOption('choose')}
                        />
                      )}
                      {replayTitleLabel}
                    </label>
                    <div
                      className={classnames('replay-picker--container', {
                        disabled: inEditMode && replaySource !== 'choose',
                      })}
                    >
                      <fieldset-section>
                        <div className="table__wrapper">
                          <table className="table table--livestream-data">
                            <tbody>
                              {livestreamData
                                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                                .map((item, i) => (
                                  <>
                                    <tr className="livestream__data-row-spacer" key={item.id + '_spacer'} />
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
                                          onChange={() => {}}
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
                                  </>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </fieldset-section>
                      {totalPages > 1 && (
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
                      )}
                    </div>
                  </>
                )}
                {(fileSource === SOURCE_SELECT || inEditMode) && !hasLivestreamData && !isCheckingLivestreams && (
                  <>
                    <label className="disabled">
                      {inEditMode && (
                        <FormField
                          name="show-replays"
                          key="show-replays"
                          type="radio"
                          checked={replaySource === 'choose'}
                          onClick={() => updateReplayOption('choose')}
                        />
                      )}
                      {replayTitleLabel}
                    </label>
                    <div className="main--empty empty disabled">
                      <Empty text={__('No replays found.')} />
                    </div>
                  </>
                )}
                {(fileSource === SOURCE_SELECT || inEditMode) && isCheckingLivestreams && (
                  <>
                    <label className="disabled">
                      {inEditMode && (
                        <FormField
                          name="replay-source"
                          value="choose"
                          key="show-replays-spin"
                          type="radio"
                          checked={replaySource === 'choose'}
                          onClick={() => updateReplayOption('choose')}
                        />
                      )}
                      {replayTitleLabel}
                    </label>
                    <div className="main--empty empty">
                      <Spinner small />
                    </div>
                  </>
                )}

                {inEditMode && (
                  <div className="file-upload">
                    <label>
                      <FormField
                        name="replay-source"
                        type="radio"
                        checked={replaySource === 'upload'}
                        onClick={() => updateReplayOption('upload')}
                      />
                      Upload Replay
                    </label>
                    <FileSelector
                      disabled={replaySource !== 'upload'}
                      currentPath={currentFile}
                      onFileChosen={handleFileChange}
                      accept={SIMPLE_SITE ? 'video/mp4,video/x-m4v,video/*' : undefined}
                      placeholder={__('Select video replay file to upload')}
                    />
                    {getUploadMessage()}
                  </div>
                )}
              </>
              {/* @endif */}
            </React.Fragment>
          </div>
        </>
      }
    />
  );
}

export default PublishLivestream;
