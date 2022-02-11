// @flow
import * as MODALS from 'constants/modal_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import Lbry from 'lbry';
import { DOMAIN, THUMBNAIL_CDN_SIZE_LIMIT_BYTES } from 'config';
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
  thumbnailParam: ?string,
  thumbnailParamError: boolean,
  thumbnailParamStatus: string,
  openModal: (id: string, {}) => void,
  updatePublishForm: ({}) => void,
  updateThumbnailParams: ({}) => void,
  resetThumbnailStatus: () => void,
};

function SelectThumbnail(props: Props) {
  const {
    filePath,
    fileInfos,
    myClaimForUri,
    formDisabled,
    uploadThumbnailStatus: status,
    openModal,
    updatePublishForm,
    thumbnailParam,
    thumbnailParamStatus,
    updateThumbnailParams,
    thumbnailPath,
    resetThumbnailStatus,
  } = props;

  const publishForm = !updateThumbnailParams;
  const thumbnail = publishForm ? props.thumbnail : thumbnailParam;
  const thumbnailError = publishForm ? props.thumbnailError : props.thumbnailParamError;

  const accept = '.png, .jpg, .jpeg, .gif';
  const manualInput = status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL;
  const thumbUploaded = status === THUMBNAIL_STATUSES.COMPLETE && thumbnail;
  const isUrlInput = thumbnail !== ThumbnailMissingImage && thumbnail !== ThumbnailBrokenImage;

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

  function handleThumbnailChange(e: SyntheticInputEvent<*>) {
    const newThumbnail = e.target.value.replace(' ', '');

    if (updateThumbnailParams) {
      updateThumbnailParams({ thumbnail_url: newThumbnail });
    } else {
      updatePublishForm({ thumbnail: newThumbnail });
    }
  }

  React.useEffect(() => {
    if (updateThumbnailParams && status !== thumbnailParamStatus) {
      updateThumbnailParams({ thumbnail_status: status });
    }
  }, [status, thumbnailParamStatus, updateThumbnailParams]);

  let thumbnailSrc;
  if (!thumbnail) {
    thumbnailSrc = ThumbnailMissingImage;
  } else if (thumbnailError) {
    thumbnailSrc =
      (manualInput && ThumbnailBrokenImage) || (status !== THUMBNAIL_STATUSES.COMPLETE && ThumbnailMissingImage);
  } else {
    thumbnailSrc = thumbnail;
  }

  /*
    Note:
    We are using backgroundImage instead of an <img /> to zoom if the selected thumbnail isn't
    the proper aspect ratio. This is to avoid blackbars on the side of images and inconsistent thumbnails
    We still need to render the image to see if there is an error loading the url
  */
  const thumbPreview = (
    <div className="column__item thumbnail-picker__preview" style={{ backgroundImage: `url(${String(thumbnailSrc)})` }}>
      {thumbUploaded &&
        thumbnailError !== false &&
        __('This will be visible in a few minutes after you submit this form.')}
      <img
        style={{ display: 'none' }}
        src={thumbnail}
        alt={__('Thumbnail Preview')}
        onError={() =>
          publishForm
            ? updatePublishForm({ thumbnailError: true })
            : updateThumbnailParams({ thumbnail_error: Boolean(thumbnail) })
        }
        onLoad={() =>
          publishForm
            ? updatePublishForm({ thumbnailError: !isUrlInput })
            : updateThumbnailParams({ thumbnail_error: !isUrlInput })
        }
      />
    </div>
  );

  return (
    <>
      {status !== THUMBNAIL_STATUSES.IN_PROGRESS && (
        <>
          <label>{__('Thumbnail')}</label>
          <div className="column">
            {thumbPreview}
            {publishForm && thumbUploaded ? (
              <div className="column__item">
                <p>{__('Upload complete.')}</p>
                <div className="section__actions">
                  <Button button="link" label={__('New thumbnail')} onClick={resetThumbnailStatus} />
                </div>
              </div>
            ) : (
              <div className="column__item">
                {manualInput ? (
                  <FormField
                    type="text"
                    name="content_thumbnail"
                    label="URL"
                    placeholder="https://images.fbi.gov/alien"
                    value={thumbnail}
                    disabled={formDisabled}
                    onChange={handleThumbnailChange}
                  />
                ) : (
                  <FileSelector
                    currentPath={thumbnailPath}
                    label={__('Thumbnail')}
                    placeholder={__('Choose an enticing thumbnail')}
                    accept={accept}
                    onFileChosen={(file) =>
                      openModal(MODALS.CONFIRM_THUMBNAIL_UPLOAD, {
                        file,
                        cb: (url) => !publishForm && updateThumbnailParams({ thumbnail_url: url }),
                      })
                    }
                  />
                )}
                <div className="card__actions">
                  <Button
                    button="link"
                    label={manualInput ? __('Use thumbnail upload tool') : __('Enter a thumbnail URL')}
                    onClick={() =>
                      updatePublishForm({
                        uploadThumbnailStatus: manualInput ? THUMBNAIL_STATUSES.READY : THUMBNAIL_STATUSES.MANUAL,
                      })
                    }
                  />
                  {status === THUMBNAIL_STATUSES.READY && isSupportedVideo && IS_WEB && (
                    // Disabled on desktop until this is resolved
                    // https://github.com/electron/electron/issues/20750#issuecomment-709505902
                    <Button
                      button="link"
                      label={__('Take a snapshot from your video')}
                      onClick={() => openModal(MODALS.AUTO_GENERATE_THUMBNAIL, { filePath: actualFilePath })}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {status === THUMBNAIL_STATUSES.IN_PROGRESS && <p>{__('Uploading thumbnail')}...</p>}
      {!thumbUploaded && (
        <p className="help">
          {manualInput
            ? __('Enter a URL for your thumbnail.')
            : __('Upload your thumbnail to %domain%. Recommended ratio is 16:9, %max_size%MB max.', {
                domain: DOMAIN,
                max_size: THUMBNAIL_CDN_SIZE_LIMIT_BYTES / (1024 * 1024),
              })}
        </p>
      )}
    </>
  );
}

export default SelectThumbnail;
