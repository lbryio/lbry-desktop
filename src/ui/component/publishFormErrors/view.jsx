// @flow
import React from 'react';
import { THUMBNAIL_STATUSES, isNameValid } from 'lbry-redux';

type Props = {
  title: ?string,
  name: ?string,
  bid: ?string,
  editingURI: ?string,
  filePath: ?string,
  isStillEditing: boolean,
  uploadThumbnailStatus: string,
};

function PublishFormErrors(props: Props) {
  const { name, title, bid, editingURI, filePath, isStillEditing, uploadThumbnailStatus } = props;

  // These are extra help
  // If there is an error it will be presented as an inline error as well
  return (
    <div className="error-text">
      {!title && <div>{__('A title is required')}</div>}
      {!name && <div>{__('A URL is required')}</div>}
      {!isNameValid(name, false) && __('LBRY names cannot contain spaces or reserved symbols ($#@;/"<>%{}|^~[]`)')}
      {!bid && <div>{__('A deposit amount is required')}</div>}
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
