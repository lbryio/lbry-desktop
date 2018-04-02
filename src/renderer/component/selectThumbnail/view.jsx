// @flow
import * as modals from 'constants/modal_types';
import * as statuses from 'constants/thumbnail_upload_statuses';
import React from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';

type Props = {
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  openModal: (string, any) => void,
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
        {(status === statuses.READY || status === statuses.IN_PROGRESS) && (
          <div>
            <span className="form-field__label">{__('Thumbnail')}</span>
            <FileSelector
              fileLabel={__('Choose Thumbnail')}
              onFileChosen={path => openModal(modals.CONFIRM_THUMBNAIL_UPLOAD, { path })}
            />
          </div>
        )}

        {(status === statuses.API_DOWN || status === statuses.MANUAL) && (
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

        {status === statuses.READY && (
          <p>
            <a
              className="link"
              onClick={() => updatePublishForm({ uploadThumbnailStatus: statuses.MANUAL })}
            >
              Enter URL Manually
            </a>
          </p>
        )}

        {status === statuses.MANUAL && (
          <p>
            <a
              className="link"
              onClick={() => updatePublishForm({ uploadThumbnailStatus: statuses.READY })}
            >
              Upload Thumbnail
            </a>
          </p>
        )}

        {status === statuses.IN_PROGRESS && <div>uploading...</div>}

        {status === statuses.COMPLETE && (
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
