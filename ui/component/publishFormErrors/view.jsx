// @flow
import React from 'react';
import { THUMBNAIL_STATUSES, isNameValid } from 'lbry-redux';
import { INVALID_NAME_ERROR } from 'constants/claim';

type Props = {
  title: ?string,
  name: ?string,
  bid: ?string,
  bidError: ?string,
  editingURI: ?string,
  filePath: ?string,
  isStillEditing: boolean,
  uploadThumbnailStatus: string,
};

function PublishFormErrors(props: Props) {
  const { name, title, bid, bidError, editingURI, filePath, isStillEditing, uploadThumbnailStatus } = props;
  // These are extra help
  // If there is an error it will be presented as an inline error as well
  return (
    <div className="error__text">
      {!title && <div>{__('A title is required')}</div>}
      {!name && <div>{__('A URL is required')}</div>}
      {!isNameValid(name, false) && INVALID_NAME_ERROR}
      {!bid && <div>{__('A deposit amount is required')}</div>}
      {bidError && <div>{__('Please check your deposit amount.')}</div>}
      {uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS && (
        <div>{__('Please wait for thumbnail to finish uploading')}</div>
      )}
      {editingURI && !isStillEditing && !filePath && (
        <div>{__('Please reselect a file after changing the LBRY URL')}</div>
      )}
    </div>
  );
}

export default PublishFormErrors;
