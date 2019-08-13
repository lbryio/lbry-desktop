// @flow
import * as MODALS from 'constants/modal_types';
import { Lbry, THUMBNAIL_STATUSES } from 'lbry-redux';
import * as React from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import ThumbnailMissingImage from './thumbnail-missing.png';
import ThumbnailBrokenImage from './thumbnail-broken.png';

type Props = {
  filePath: ?string,
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  thumbnailPath: ?string,
  openModal: (id: string, {}) => void,
  updatePublishForm: ({}) => void,
  resetThumbnailStatus: () => void,
};

type State = {
  thumbnailError: boolean,
};

const filters = [
  {
    name: __('Thumbnail Image'),
    extensions: ['png', 'jpg', 'jpeg', 'gif'],
  },
];

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
      filePath,
      thumbnail,
      formDisabled,
      uploadThumbnailStatus: status,
      openModal,
      updatePublishForm,
      thumbnailPath,
      resetThumbnailStatus,
    } = this.props;

    const { thumbnailError } = this.state;

    const isSupportedVideo = Lbry.getMediaType(null, filePath) === 'video';

    let thumbnailSrc;
    if (!thumbnail) {
      thumbnailSrc = ThumbnailMissingImage;
    } else if (thumbnailError) {
      thumbnailSrc = ThumbnailBrokenImage;
    } else {
      thumbnailSrc = thumbnail;
    }

    /*
      Note:
      We are using backgroundImage instead of an <img /> to zoom if the selected thumbnail isn't
      the proper aspect ratio. This is to avoid blackbars on the side of images and inconsistent thumbnails
      We still need to render the image to see if there is an error loading the url
    */

    return (
      <div>
        {status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL ? (
          <div className="column">
            <div className="column__item thumbnail-preview" style={{ backgroundImage: `url(${thumbnailSrc})` }}>
              <img
                style={{ display: 'none' }}
                src={thumbnailSrc}
                alt={__('Thumbnail Preview')}
                onError={e => {
                  this.setState({
                    thumbnailError: true,
                  });
                }}
              />
            </div>
            <div className="column__item">
              <FormField
                type="text"
                name="content_thumbnail"
                label="URL"
                placeholder="https://spee.ch/mylogo"
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
          </div>
        ) : (
          <React.Fragment>
            {status === THUMBNAIL_STATUSES.READY && (
              <FileSelector
                currentPath={thumbnailPath}
                label={__('Thumbnail')}
                placeholder={__('Choose a thumbnail')}
                filters={filters}
                onFileChosen={path => openModal(MODALS.CONFIRM_THUMBNAIL_UPLOAD, { path })}
              />
            )}
            {status === THUMBNAIL_STATUSES.COMPLETE && thumbnail && (
              <div className="column column--space-between">
                <div className="column__item thumbnail-preview" style={{ backgroundImage: `url(${thumbnail})` }} />
                <div className="column__item">
                  <p>
                    Upload complete. <Button button="link" href={thumbnail} label={__('View it on spee.ch')} />.
                  </p>
                  <div className="card__actions">
                    <Button button="link" label={__('New thumbnail')} onClick={resetThumbnailStatus} />
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
              label={__('Enter a thumbnail URL')}
              onClick={() => updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.MANUAL })}
            />
            {isSupportedVideo && (
              <Button
                button="link"
                label={__('Take a snapshot from your video')}
                onClick={() => openModal(MODALS.AUTO_GENERATE_THUMBNAIL, { filePath })}
              />
            )}
          </div>
        )}

        {status === THUMBNAIL_STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
        <p className="help">
          {(status === undefined && __('You should reselect your file to choose a thumbnail')) ||
            (status === THUMBNAIL_STATUSES.API_DOWN ? (
              __('Enter a URL for your thumbnail.')
            ) : (
              <React.Fragment>
                {__('Upload your thumbnail to')}{' '}
                <Button button="link" label={__('spee.ch')} href="https://spee.ch/about" />.{' '}
                {__('Recommended size: 800x450 (16:9)')}
              </React.Fragment>
            ))}
        </p>
      </div>
    );
  }
}

export default SelectThumbnail;
