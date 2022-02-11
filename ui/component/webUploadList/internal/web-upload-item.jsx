// @flow
import React, { useState } from 'react';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import FileThumbnail from 'component/fileThumbnail';
import * as MODALS from 'constants/modal_types';
import { serializeFileObj } from 'util/file';
import { tusIsSessionLocked } from 'util/tus';

type Props = {
  uploadItem: FileUploadItem,
  doPublishResume: (any) => void,
  doUpdateUploadRemove: (string, any) => void,
  doOpenModal: (string, {}) => void,
};

export default function WebUploadItem(props: Props) {
  const { uploadItem, doPublishResume, doUpdateUploadRemove, doOpenModal } = props;
  const { params, file, fileFingerprint, progress, status, resumable, uploader } = uploadItem;

  const [showFileSelector, setShowFileSelector] = useState(false);
  const locked = tusIsSessionLocked(params.guid);

  function handleFileChange(newFile: WebFile, clearName = true) {
    if (serializeFileObj(newFile) === fileFingerprint) {
      setShowFileSelector(false);
      doPublishResume({ ...params, file_path: newFile });
      if (!params.guid) {
        // Can remove this if-block after January 2022.
        doUpdateUploadRemove('', params);
      }
    } else {
      doOpenModal(MODALS.CONFIRM, {
        title: __('Invalid file'),
        subtitle: __('It appears to be a different or modified file.'),
        body: <p className="help--warning">{__('Please select the same file from the initial upload.')}</p>,
        onConfirm: (closeModal) => closeModal(),
        hideCancel: true,
      });
    }
  }

  function handleCancel() {
    doOpenModal(MODALS.CONFIRM, {
      title: __('Cancel upload'),
      subtitle: __('Cancel and remove the selected upload?'),
      body: params.name ? <p className="empty">{`lbry://${params.name}`}</p> : undefined,
      onConfirm: (closeModal) => {
        if (tusIsSessionLocked(params.guid)) {
          // Corner-case: it's possible for the upload to resume in another tab
          // after the modal has appeared. Make a final lock-check here.
          // We can invoke a toast here, but just do nothing for now.
          // The upload status should make things obvious.
        } else {
          if (uploader) {
            if (resumable) {
              // $FlowFixMe - couldn't resolve to TusUploader manually.
              uploader.abort(true); // TUS
            } else {
              uploader.abort(); // XHR
            }
          }

          // The second parameter (params) can be removed after January 2022.
          doUpdateUploadRemove(params.guid, params);
        }
        closeModal();
      },
    });
  }

  function resolveProgressStr() {
    if (locked) {
      return __('File being uploaded in another tab or window.');
    }

    if (!uploader) {
      return __('Stopped.');
    }

    if (resumable) {
      if (status) {
        switch (status) {
          case 'retry':
            return __('Retrying...');
          case 'error':
            return __('Failed.');
          case 'conflict':
            return __('Stopped. Duplicate session detected.');
          default:
            return status;
        }
      } else {
        const progressInt = parseInt(progress);
        return progressInt === 100 ? __('Processing...') : __('Uploading...');
      }
    } else {
      return __('Uploading...');
    }
  }

  function getRetryButton() {
    if (!resumable || locked) {
      return null;
    }

    if (uploader) {
      // Should still be uploading. Don't show.
      return null;
    } else {
      // Refreshed or connection broken.
      const isFileActive = file instanceof File;
      return (
        <Button
          label={isFileActive ? __('Resume') : __('Retry')}
          button="link"
          onClick={() => {
            if (isFileActive) {
              doPublishResume({ ...params, file_path: file });
            } else {
              setShowFileSelector(true);
            }
          }}
          disabled={showFileSelector}
        />
      );
    }
  }

  function getCancelButton() {
    if (!locked) {
      return <Button label={__('Cancel')} button="link" onClick={handleCancel} />;
    }
  }

  function getFileSelector() {
    return (
      <div className="claim-preview--padded">
        <FileSelector
          label={__('File')}
          onFileChosen={handleFileChange}
          // https://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
          accept={'video/mp4,video/x-m4v,video/*,audio/*'}
          placeholder={__('Select the file to resume upload...')}
        />
      </div>
    );
  }

  function getProgressBar() {
    return (
      <>
        <div className="claim-upload__progress--label">lbry://{params.name}</div>
        <div className={'claim-upload__progress--outer card--inline'}>
          <div className={'claim-upload__progress--inner'} style={{ width: `${progress}%` }}>
            <span className="claim-upload__progress--inner-text">{resolveProgressStr()}</span>
          </div>
        </div>
      </>
    );
  }

  React.useEffect(() => {
    if (locked && showFileSelector) {
      setShowFileSelector(false);
    }
  }, [locked, showFileSelector]);

  return (
    <li className={'web-upload-item claim-preview claim-preview--inactive card--inline'}>
      <FileThumbnail thumbnail={params.thumbnail_url} />
      <div className={'claim-preview-metadata'}>
        <div className="claim-preview-info">
          <div className="claim-preview__title">{params.title}</div>
          <div className="card__actions--inline">
            {getRetryButton()}
            {getCancelButton()}
          </div>
        </div>
        {showFileSelector && getFileSelector()}
        {!showFileSelector && getProgressBar()}
      </div>
    </li>
  );
}
