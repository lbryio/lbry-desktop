// @flow
import { STATUSES } from 'lbry-redux';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';

type Props = {
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  openModal: (string, {}) => void,
  updatePublishForm: ({}) => void,
};

class SelectThumbnail extends React.PureComponent<Props> {
  render() {
    const {
      thumbnail,
      formDisabled,
      uploadThumbnailStatus: status,
      openModal,
      updatePublishForm,
    } = this.props;

    return (
      <div>
        {(status === STATUSES.READY || status === STATUSES.IN_PROGRESS) && (
          <div>
            <span className="form-field__label">{__('Thumbnail')}</span>
            <FileSelector
              fileLabel={__('Choose Thumbnail')}
              onFileChosen={path => openModal(MODALS.CONFIRM_THUMBNAIL_UPLOAD, { path })}
            />
          </div>
        )}

        {(status === STATUSES.API_DOWN || status === STATUSES.MANUAL) && (
          <FormField
            stretch
            type="text"
            name="content_thumbnail"
            label={__('Thumbnail')}
            placeholder="http://spee.ch/mylogo"
            value={thumbnail}
            disabled={formDisabled}
            onChange={e => updatePublishForm({ thumbnail: e.target.value })}
          />
        )}

        {status === STATUSES.READY && (
          <p>
            <a
              className="link"
              onClick={() => updatePublishForm({ uploadThumbnailStatus: STATUSES.MANUAL })}
            >
              Enter URL Manually
            </a>
          </p>
        )}

        {status === STATUSES.MANUAL && (
          <p>
            <a
              className="link"
              onClick={() => updatePublishForm({ uploadThumbnailStatus: STATUSES.READY })}
            >
              Upload Thumbnail
            </a>
          </p>
        )}

        {status === STATUSES.IN_PROGRESS && <p>uploading...</p>}

        {status === STATUSES.COMPLETE && (
          <div>
            <p className="form-field__label">{__('Thumbnail')}</p>
            <p>
              Upload Complete<br />URL: {thumbnail}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default SelectThumbnail;
