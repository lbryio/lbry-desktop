// @flow
import { THUMBNAIL_STATUSES, MODALS } from 'lbry-redux';
import React from 'react';
import { FormField, FormRow } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Native from 'native';

type Props = {
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  thumbnailPath: ?string,
  openModal: ({ id: string }, {}) => void,
  updatePublishForm: ({}) => void,
  resetThumbnailStatus: () => void,
};

type State = {
  thumbnailValid: boolean,
}

class SelectThumbnail extends React.PureComponent<Props, State> {
  constructor() {
    super();
    
    this.state = {
      thumbnailValid: false,
    };
    
    (this: any).handleThumbnailChange = this.handleThumbnailChange.bind(this);
  }
  
  handleThumbnailChange(e) {
    const { updatePublishForm } = this.props;
    const newThumbnail = e.target.value.replace(' ', '');
    
    updatePublishForm({ thumbnail: newThumbnail });
    this.setState({ thumbnailValid: true })
  }
  
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
    
    const { thumbnailValid } = this.state;
    
    return (
      <div className="card__content">
        {status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL ? (
          <div className="column">
            <div className="column__item">
              <FormField
                stretch
                type="text"
                name="content_thumbnail"
                label={'URL'}
                placeholder="http://spee.ch/mylogo"
                value={thumbnail}
                disabled={formDisabled}
                onChange={this.handleThumbnailChange}
                />
              <div className="card__actions">
                <Button
                  button="link"
                  label={__('Use thumbnail upload tool')}
                  onClick={() => updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.READY })}
                />
              </div>
            </div>
            <img
              src={(!thumbnail || !thumbnailValid) ? Native.imagePath('thumbnail.png') : thumbnail}
              className="column__item thumbnail-preview"
              alt="Thumbnail Preview"
              onError={() => {
                this.setState({ thumbnailValid: false })
              }}
            />
          </div>
        ) : (
          <div className="form-row--padded">
            {status === THUMBNAIL_STATUSES.READY && (
              <FileSelector
                currentPath={thumbnailPath}
                fileLabel={__('Choose Thumbnail')}
                onFileChosen={path => openModal({ id: MODALS.CONFIRM_THUMBNAIL_UPLOAD }, { path })}
              />
            )}
            {status === THUMBNAIL_STATUSES.COMPLETE && (
              <div className="column column--space-between">
                <img
                  className="column__item thumbnail-preview"
                  src={thumbnail}
                  />
                <div className="column__item">
                  <p>
                    Upload complete.{' '}
                    <Button button="link" href={thumbnail} label={__('View it on spee.ch')} />
                  </p>
                  <Button button="link" label={__('New thumbnail')} onClick={resetThumbnailStatus} />
                </div>
            </div>
            )}
          </div>
        )}
        <div className="card__actions">
          {status === THUMBNAIL_STATUSES.READY && (
            <Button
              button="link"
              label={__('Or enter a URL manually')}
              onClick={() =>
                updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.MANUAL })
              }
            />
          )}
        </div>

        {status === THUMBNAIL_STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
      </div>
    );
  }
}

export default SelectThumbnail;
