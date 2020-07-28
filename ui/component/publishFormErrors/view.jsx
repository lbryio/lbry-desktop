// @flow
import React from 'react';
import { THUMBNAIL_STATUSES, isNameValid } from 'lbry-redux';
import { INVALID_NAME_ERROR } from 'constants/claim';
import * as PUBLISH_MODES from 'constants/publish_types';

type Props = {
  mode: ?string,
  title: ?string,
  name: ?string,
  bid: ?string,
  bidError: ?string,
  editingURI: ?string,
  filePath: ?string,
  fileText: ?string,
  isStillEditing: boolean,
  uploadThumbnailStatus: string,
};

function PublishFormErrors(props: Props) {
  const {
    name,
    mode,
    title,
    bid,
    bidError,
    editingURI,
    filePath,
    fileText,
    isStillEditing,
    uploadThumbnailStatus,
  } = props;
  const emptyStoryError = mode === PUBLISH_MODES.STORY && (!fileText || fileText.trim() === '');
  // These are extra help
  // If there is an error it will be presented as an inline error as well
  return (
    <div className="error__text">
      {!title && <div>{__('A title is required')}</div>}
      {!name && <div>{__('A URL is required')}</div>}
      {!isNameValid(name, false) && INVALID_NAME_ERROR}
      {!bid && <div>{__('A deposit amount is required')}</div>}
      {bidError && <div>{__('Please check your deposit amount.')}</div>}
      {emptyStoryError && <div>{__("Can't publish an empty story")}</div>}
      {uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS && (
        <div>{__('Please wait for thumbnail to finish uploading')}</div>
      )}
      {!!editingURI && !isStillEditing && !filePath && (
        <div>{__('Please reselect a file after changing the LBRY URL')}</div>
      )}
    </div>
  );
}

export default PublishFormErrors;
