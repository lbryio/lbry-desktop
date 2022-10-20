// @flow
import { SITE_NAME, WEB_PUBLISH_SIZE_LIMIT_GB, SIMPLE_SITE } from 'config';
import React, { useState, useEffect } from 'react';
import Lbry from 'lbry';
import { toHex } from 'util/hex';
import { sanitizeName } from 'util/lbryURI';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import I18nMessage from 'component/i18nMessage';
import Spinner from 'component/spinner';
import * as PUBLISH_MODES from 'constants/publish_types';
import PublishName from 'component/publish/shared/publishName';
import classnames from 'classnames';
import * as PAGES from 'constants/pages';
import { SOURCE_SELECT } from 'constants/publish_sources';
import { NEW_LIVESTREAM_REPLAY_API } from 'constants/livestream';

type Props = {
  uri: ?string,
  mode: ?string,
  disabled: boolean,
  // --- redux ---
  name: ?string,
  title: ?string,
  filePath: string | WebFile,
  isStillEditing: boolean,
  balance: number,
  size: number,
  duration: number,
  isVid: boolean,
  setPublishMode: (string) => void,
  setOverMaxBitrate: (boolean) => void,
  fileSource: string,
  myClaimForUri: ?StreamClaim,
  activeChannelClaim: ?ChannelClaim,
  doUpdatePublishForm: ({}) => void,
  doToast: ({ message: string, isError?: boolean }) => void,
};

function PublishFile(props: Props) {
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
    disabled,
    size,
    duration,
    isVid,
    setPublishMode,
    // setPrevFileText,
    // setWaitForFile,
    setOverMaxBitrate,
    fileSource,
    myClaimForUri,
    activeChannelClaim,
    // inEditMode,
  } = props;

  const RECOMMENDED_BITRATE = 9500000;
  const MAX_BITRATE = 19500000;
  const TV_PUBLISH_SIZE_LIMIT_BYTES = WEB_PUBLISH_SIZE_LIMIT_GB * 1073741824;
  const TV_PUBLISH_SIZE_LIMIT_GB_STR = String(WEB_PUBLISH_SIZE_LIMIT_GB);

  const MARKDOWN_FILE_EXTENSIONS = ['txt', 'md', 'markdown'];
  const [oversized, setOversized] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileType, setCurrentFileType] = useState(null);
  const UPLOAD_SIZE_MESSAGE = __('%SITE_NAME% uploads are limited to %limit% GB.', {
    SITE_NAME,
    limit: TV_PUBLISH_SIZE_LIMIT_GB_STR,
  });

  const bitRate = getBitrate(size, duration);
  const bitRateIsOverMax = bitRate > MAX_BITRATE;

  const [livestreamData, setLivestreamData] = React.useState([]);
  const hasLivestreamData = livestreamData && Boolean(livestreamData.length);

  const claimChannelId =
    (myClaimForUri && myClaimForUri.signing_channel && myClaimForUri.signing_channel.claim_id) ||
    (activeChannelClaim && activeChannelClaim.claim_id);
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  // const [isCheckingLivestreams, setCheckingLivestreams] = React.useState(false);

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

  useEffect(() => {
    updatePublishForm({ title: title });
  }, [filePath]);

  /*
  const normalizeUrlForProtocol = (url) => {
    if (url.startsWith('https://')) {
      return url;
    } else {
      if (url.startsWith('http://')) {
        return url;
      } else if (url) {
        return `https://${url}`;
      }
    }
  };
  */

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

  async function fetchLivestreams(channelId, channelName) {
    // setCheckingLivestreams(true);
    let signedMessage;
    try {
      await Lbry.channel_sign({
        channel_id: channelId,
        hexdata: toHex(channelName || ''),
      }).then((data) => {
        signedMessage = data;
      });
    } catch (e) {
      throw e;
    }
    if (signedMessage) {
      const encodedChannelName = encodeURIComponent(channelName || '');
      const newEndpointUrl =
        `${NEW_LIVESTREAM_REPLAY_API}?channel_claim_id=${String(channelId)}` +
        `&signature=${signedMessage.signature}&signature_ts=${signedMessage.signing_ts}&channel_name=${
          encodedChannelName || ''
        }`;

      const responseFromNewApi = await fetch(newEndpointUrl);

      const data = (await responseFromNewApi.json()).data;

      let newData = [];
      if (data && data.length > 0) {
        for (const dataItem of data) {
          if (dataItem.Status.toLowerCase() === 'inprogress' || dataItem.Status.toLowerCase() === 'ready') {
            const objectToPush = {
              data: {
                fileLocation: dataItem.URL,
                fileDuration:
                  dataItem.Status.toLowerCase() === 'inprogress'
                    ? __('Processing...(') + dataItem.PercentComplete + '%)'
                    : (dataItem.Duration / 1000000000).toString(),
                thumbnails: dataItem.ThumbnailURLs !== null ? dataItem.ThumbnailURLs : [],
                uploadedAt: dataItem.Created,
              },
            };
            newData.push(objectToPush);
          }
        }
      }

      setLivestreamData(newData);
      // setCheckingLivestreams(false);
    }
  }

  useEffect(() => {
    if (activeChannelClaim && activeChannelClaim.claim_id && activeChannelName) {
      fetchLivestreams(activeChannelClaim.claim_id, activeChannelName);
    }
  }, [claimChannelId, activeChannelName]);

  useEffect(() => {
    if (activeChannelClaim && activeChannelClaim.claim_id && activeChannelName) {
      fetchLivestreams(activeChannelClaim.claim_id, activeChannelName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimChannelId, activeChannelName]);

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

  function linkReplays() {
    return (
      <p className="help--link">
        <I18nMessage
          tokens={{
            livestream_replay_instead: (
              <Button
                button="link"
                label={__('Livestream Replay instead')}
                navigate={`/$/${PAGES.LIVESTREAM}?s=Replay`}
              />
            ),
          }}
        >
          Would you like to publish a %livestream_replay_instead%?
        </I18nMessage>
      </p>
    );
  }

  function getUploadMessage() {
    // @if TARGET='web'
    if (oversized) {
      return (
        <p className="help--error">
          {UPLOAD_SIZE_MESSAGE}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://help.odysee.tv/category-uploading/" />
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
          <Button button="link" label={__('Upload Guide')} href="https://help.odysee.tv/category-uploading/" />
        </p>
      );
    }

    if (isVid && !duration) {
      return (
        <p className="help--warning">
          {__(
            'Your video may not be the best format. Use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps) for more reliable streaming.'
          )}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://help.odysee.tv/category-uploading/" />
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
            'For video content, use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps) for more reliable streaming. %SITE_NAME% uploads are restricted to %limit% GB.',
            { SITE_NAME, limit: TV_PUBLISH_SIZE_LIMIT_GB_STR }
          )}{' '}
          <Button button="link" label={__('Upload Guide')} href="https://help.odysee.tv/category-uploading/" />
        </p>
      );
    }
    // @endif
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

    // $FlowFixMe
    titleInput.current.input.current.focus();

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

    updatePublishForm({ fileMime: file.type });

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
      // setPublishMode(PUBLISH_MODES.FILE);
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
      publishFormParams.name = sanitizeName(fileName);
    }

    // File path is not supported on web for security reasons so we use the name instead.
    setCurrentFile(file.path || file.name);
    updatePublishForm(publishFormParams);
  }

  function autofillTitle(file) {
    const newTitle = (file && file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || name || '';
    if (!title) updatePublishForm({ title: newTitle });
  }

  const titleInput = React.createRef();

  return (
    <Card
      className={classnames({
        'card--disabled': disabled || balance === 0,
      })}
      actions={
        <>
          <div className="card--file">
            <React.Fragment>
              <>
                <FileSelector
                  disabled={disabled}
                  currentPath={currentFile}
                  onFileChosen={handleFileChange}
                  // accept={SIMPLE_SITE ? 'video/mp4,video/x-m4v,video/*,audio/*,image/*' : undefined}
                  placeholder={
                    SIMPLE_SITE ? __('Select video, audio or image file to upload') : __('Select a file to upload')
                  }
                  autoFocus
                />
                {getUploadMessage()}
                {hasLivestreamData && linkReplays()}

                {fileSource === SOURCE_SELECT && (
                  <div className="main--empty empty">
                    <Spinner small />
                  </div>
                )}
              </>
              <div className="form-spacer">
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
                  ref={titleInput}
                />
              </div>
              <PublishName uri={uri} />
            </React.Fragment>
          </div>
        </>
      }
    />
  );
}

export default PublishFile;
