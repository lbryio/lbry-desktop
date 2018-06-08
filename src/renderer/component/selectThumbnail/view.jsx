// @flow
import { STATUSES, MODALS } from 'lbry-redux';
import React from 'react';
import { FormField, FormRow } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';

type Props = {
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  thumbnailPath: ?string,
  openModal: ({ id: string }, {}) => void,
  updatePublishForm: ({}) => void,
  resetThumbnailStatus: () => void,
};

class SelectThumbnail extends React.PureComponent<Props> {
  render() {
    const {
      thumbnail,
      formDisabled,
      uploadThumbnailStatus: status,
      openModal,
      updatePublishForm,
      thumbnailPath,
      resetThumbnailStatus,
    } = this.props;

    return (
      <div>
        {status === STATUSES.API_DOWN || status === STATUSES.MANUAL ? (
          <FormRow padded>
            <FormField
              stretch
              type="text"
              name="content_thumbnail"
              label={__('Url')}
              placeholder="http://spee.ch/mylogo"
              value={thumbnail}
              disabled={formDisabled}
              onChange={e => updatePublishForm({ thumbnail: e.target.value })}
            />
          </FormRow>
        ) : (
          <div className="form-row--padded">
            {(status === STATUSES.READY || status === STATUSES.COMPLETE) && (
              <FileSelector
                currentPath={thumbnailPath}
                fileLabel={__('Choose Thumbnail')}
                onFileChosen={path => openModal({ id: MODALS.CONFIRM_THUMBNAIL_UPLOAD }, { path })}
              />
            )}
            {status === STATUSES.COMPLETE && (
              <div>
                <p>
                  Upload complete. View it{' '}
                  <Button button="link" href={thumbnail} label={__('here')} />.
                </p>
                <Button button="link" label={__('New thumbnail')} onClick={resetThumbnailStatus} />
              </div>
            )}
          </div>
        )}
        <div className="card__actions">
          {status === STATUSES.READY && (
            <Button
              button="link"
              label={__('Or enter a URL manually')}
              onClick={() => updatePublishForm({ uploadThumbnailStatus: STATUSES.MANUAL })}
            />
          )}
          {status === STATUSES.MANUAL && (
            <Button
              button="link"
              label={__('Use thumbnail upload tool')}
              onClick={() => updatePublishForm({ uploadThumbnailStatus: STATUSES.READY })}
            />
          )}
        </div>

        {status === STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
      </div>
    );
  }
}

export default SelectThumbnail;
