// @flow
import * as MODALS from 'constants/modal_types';
import { Lbry, THUMBNAIL_STATUSES } from 'lbry-redux';
import { DOMAIN } from 'config';
import * as React from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import ThumbnailMissingImage from './thumbnail-missing.png';
import ThumbnailBrokenImage from './thumbnail-broken.png';

type Props = {
  filePath: ?string,
  fileInfos: { [string]: FileListItem },
  myClaimForUri: ?StreamClaim,
  thumbnail: ?string,
  formDisabled: boolean,
  uploadThumbnailStatus: string,
  thumbnailPath: ?string,
  thumbnailError: ?string,
  openModal: (id: string, {}) => void,
  updatePublishForm: ({}) => void,
  resetThumbnailStatus: () => void,
};

class SelectThumbnail extends React.PureComponent<Props> {
  constructor() {
    super();
    (this: any).handleThumbnailChange = this.handleThumbnailChange.bind(this);
  }

  handleThumbnailChange(e: SyntheticInputEvent<*>) {
    const { updatePublishForm } = this.props;
    const newThumbnail = e.target.value.replace(' ', '');

    updatePublishForm({
      thumbnail: newThumbnail,
      thumbnailError: newThumbnail.startsWith('data:image'),
    });
  }

  render() {
    const {
      filePath,
      fileInfos,
      myClaimForUri,
      thumbnail,
      formDisabled,
      uploadThumbnailStatus: status,
      openModal,
      updatePublishForm,
      thumbnailPath,
      thumbnailError,
      resetThumbnailStatus,
    } = this.props;

    const accept = '.png, .jpg, .jpeg, .gif';

    const outpoint = myClaimForUri ? `${myClaimForUri.txid}:${myClaimForUri.nout}` : undefined;
    const fileInfo = outpoint ? fileInfos[outpoint] : undefined;
    const downloadPath = fileInfo ? fileInfo.download_path : undefined;

    const actualFilePath = filePath || downloadPath;
    let isSupportedVideo = false;
    if (typeof actualFilePath === 'string') {
      isSupportedVideo = Lbry.getMediaType(null, actualFilePath) === 'video';
    } else if (actualFilePath && actualFilePath.type) {
      isSupportedVideo = actualFilePath.type.split('/')[0] === 'video';
    }

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
                onError={(e) => {
                  updatePublishForm({ thumbnailError: true });
                }}
              />
            </div>
            <div className="column__item">
              <FormField
                type="text"
                name="content_thumbnail"
                label="URL"
                placeholder="https://images.fbi.gov/alien"
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
                placeholder={__('Thumbnails that entice a viewer to watch a video work best')}
                accept={accept}
                onFileChosen={(file) => openModal(MODALS.CONFIRM_THUMBNAIL_UPLOAD, { file })}
              />
            )}
            {status === THUMBNAIL_STATUSES.COMPLETE && thumbnail && (
              <div className="column column--space-between">
                <div
                  className="column__item thumbnail-preview"
                  // style={{ backgroundImage: `url(${thumbnail})` }}
                >
                  {__('This will be visible in a few minutes.')}
                </div>
                <div className="column__item">
                  <p>{__('Upload complete.')}</p>
                  <div className="section__actions">
                    <Button button="link" label={__('New thumbnail')} onClick={resetThumbnailStatus} />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {status === THUMBNAIL_STATUSES.READY && (
          <div className="section__actions">
            <Button
              button="link"
              label={__('Enter a thumbnail URL')}
              onClick={() => updatePublishForm({ uploadThumbnailStatus: THUMBNAIL_STATUSES.MANUAL })}
            />
            {isSupportedVideo && IS_WEB && (
              // Disabled on desktop until this is resolved
              // https://github.com/electron/electron/issues/20750#issuecomment-709505902
              <Button
                button="link"
                label={__('Take a snapshot from your video')}
                onClick={() => openModal(MODALS.AUTO_GENERATE_THUMBNAIL, { filePath: actualFilePath })}
              />
            )}
          </div>
        )}

        {status === THUMBNAIL_STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
        {status !== THUMBNAIL_STATUSES.COMPLETE && (
          <p className="help">
            {status === THUMBNAIL_STATUSES.API_DOWN
              ? __('Enter a URL for your thumbnail.')
              : __('Upload your thumbnail to %domain%. Recommended size is 16:9.', { domain: DOMAIN })}
          </p>
        )}
      </div>
    );
  }
}

export default SelectThumbnail;
