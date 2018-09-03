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
  thumbnailErrorImage: string,
};

class SelectThumbnail extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      thumbnailError: false,
      thumbnailErrorImage: 'no-thumbnail.png',
    };

    (this: any).handleThumbnailChange = this.handleThumbnailChange.bind(this);
  }

  handleThumbnailChange(e: SyntheticInputEvent<*>) {
    const { updatePublishForm } = this.props;
    const newThumbnail = e.target.value.replace(' ', '');

    updatePublishForm({ thumbnail: newThumbnail });
    this.setState({ thumbnailError: false, thumbnailErrorImage: 'no-thumbnail.png' });
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
    const { thumbnailError, thumbnailErrorImage } = this.state;
    const thumbnailSrc =
      !thumbnail || thumbnailError ? Native.imagePath(thumbnailErrorImage) : thumbnail;

    /*
      Note:
      We are using backgroundImage instead of an <img /> to zoom if the selected thumbnail isn't
      the proper aspect ratio. This is to avoid blackbars on the side of images and inconsistent thumbnails
      We still need to render the image to see if there is an error loading the url
    */

    return (
      <div className="card__content">
        {status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL ? (
          <div className="column">
            <div
              className="column__item thumbnail-preview card__media"
              style={{ backgroundImage: `url(${thumbnailSrc})` }}
            >
              <img
                style={{ display: 'none' }}
                src={thumbnailSrc}
                alt={__('Thumbnail Preview')}
                onError={() => {
                  this.setState({
                    thumbnailError: true,
                    thumbnailErrorImage:
                      thumbnail && thumbnail.length > 0 ? 'broken.png' : 'no-thumbnail.png',
                  });
                }}
              />
            </div>
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
