// @flow
import { THUMBNAIL_STATUSES, MODALS } from 'lbry-redux';
import * as React from 'react';
import { FormField } from 'component/common/form';
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
  thumbnailError: boolean,
};

class SelectThumbnail extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      thumbnailError: false,
    };

    (this: any).handleThumbnailChange = this.handleThumbnailChange.bind(this);
  }

  handleThumbnailChange(e: SyntheticInputEvent<*>) {
    const { updatePublishForm } = this.props;
    const newThumbnail = e.target.value.replace(' ', '');

    updatePublishForm({ thumbnail: newThumbnail });
    this.setState({ thumbnailError: false });
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
    const { thumbnailError } = this.state;
    const thumbnailSrc =
      !thumbnail || thumbnailError ? Native.imagePath('thumbnail.png') : thumbnail;

    return (
      <div className="card__content">
        {status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL ? (
          <div className="column">
            <img
              src={thumbnailSrc}
              className="column__item thumbnail-preview"
              alt={__('Thumbnail Preview')}
              onError={() => {
                this.setState({ thumbnailError: true });
              }}
            />
            <div className="column__item">
              <FormField
                className="input--thumbnail"
                type="text"
                name="content_thumbnail"
                label="URL"
                placeholder="http://spee.ch/mylogo"
                value={thumbnail}
                disabled={formDisabled}
                onChange={this.handleThumbnailChange}
              />
              <div className="card__actions">
                <Button
                  button="link"
                  label={__('Use thumbnail upload tool')}
                  onClick={() =>
                    updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.READY })
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
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
                  alt={__('Thumbnail Preview')}
                />
                <div className="column__item">
                  <p>
                    Upload complete.{' '}
                    <Button button="link" href={thumbnail} label={__('View it on spee.ch')} />.
                  </p>
                  <div className="card__actions">
                    <Button
                      button="link"
                      label={__('New thumbnail')}
                      onClick={resetThumbnailStatus}
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {status === THUMBNAIL_STATUSES.READY && (
          <div className="card__actions">
            <Button
              button="link"
              label={__('Or enter a URL manually')}
              onClick={() =>
                updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.MANUAL })
              }
            />
          </div>
        )}

        {status === THUMBNAIL_STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
      </div>
    );
  }
}

export default SelectThumbnail;
