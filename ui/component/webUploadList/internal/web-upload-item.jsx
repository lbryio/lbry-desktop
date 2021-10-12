// @flow
import React, { useState } from 'react';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import FileThumbnail from 'component/fileThumbnail';
import * as MODALS from 'constants/modal_types';
import { serializeFileObj } from 'util/file';

type Props = {
  uploadItem: FileUploadItem,
  doPublishResume: (any) => void,
  doUpdateUploadRemove: (any) => void,
  doOpenModal: (string, {}) => void,
};

export default function WebUploadItem(props: Props) {
  const { uploadItem, doPublishResume, doUpdateUploadRemove, doOpenModal } = props;
  const { params, file, fileFingerprint, progress, status, tusUploader } = uploadItem;

  const [showFileSelector, setShowFileSelector] = useState(false);

  function handleFileChange(newFile: WebFile, clearName = true) {
    if (serializeFileObj(newFile) === fileFingerprint) {
      setShowFileSelector(false);
      doPublishResume({ ...params, file_path: newFile });
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
        if (tusUploader) {
          tusUploader.abort(true);
        }
        doUpdateUploadRemove(params);
        closeModal();
      },
    });
  }

  function resolveProgressStr() {
    if (!tusUploader) {
      return __('Stopped.');
    } else if (status) {
      switch (status) {
        case 'retry':
          return __('Retrying...');
        case 'error':
          return __('Failed.');
        default:
          return status;
      }
    } else {
      const progressInt = parseInt(progress);
      return progressInt === 100 ? __('Processing...') : __('Uploading...');
    }
  }

  function getRetryButton() {
    if (!tusUploader) {
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
    } else {
      return null;
    }
  }

  function getCancelButton() {
    return <Button label={__('Cancel')} button="link" onClick={handleCancel} />;
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
            {resolveProgressStr()}
          </div>
        </div>
      </>
    );
  }

  return (
    <li className={'web-upload-item claim-preview claim-preview--padded claim-preview--inactive card--inline'}>
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
