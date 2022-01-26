// @flow
import React from 'react';
import { THUMBNAIL_CDN_SIZE_LIMIT_BYTES } from 'config';
import FileSelector from 'component/common/file-selector';
import { IMG_CDN_PUBLISH_URL } from 'constants/cdn_urls';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import usePersistedState from 'effects/use-persisted-state';

const accept = '.png, .jpg, .jpeg, .gif';
const STATUS = { READY: 'READY', UPLOADING: 'UPLOADING' };

type Props = {
  assetName: string,
  currentValue: ?string,
  onUpdate: (string, boolean) => void,
  recommended: string,
  title: string,
  onDone?: () => void,
  inline?: boolean,
};

function SelectAsset(props: Props) {
  const { onUpdate, onDone, assetName, currentValue, recommended, title, inline } = props;
  const [pathSelected, setPathSelected] = React.useState('');
  const [fileSelected, setFileSelected] = React.useState<any>(null);
  const [fileSize, setFileSize] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState(STATUS.READY);
  const [useUrl, setUseUrl] = usePersistedState('thumbnail-upload:mode', false);
  const [url, setUrl] = React.useState(currentValue);
  const [error, setError] = React.useState();

  function doUploadAsset() {
    const uploadError = (error = '') => {
      setError(error);
    };

    const onSuccess = (thumbnailUrl) => {
      setUploadStatus(STATUS.READY);
      onUpdate(thumbnailUrl, !useUrl);

      if (onDone) {
        onDone();
      }
    };

    setUploadStatus(STATUS.UPLOADING);

    const data = new FormData();
    data.append('file-input', fileSelected);
    data.append('upload', 'Upload');

    return fetch(IMG_CDN_PUBLISH_URL, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.text())
      .then((text) => {
        try {
          return text.length ? JSON.parse(text) : {};
        } catch {
          throw new Error(text);
        }
      })
      .then((json) => {
        return json.type === 'success'
          ? onSuccess(`${json.message}`)
          : uploadError(
              json.message || __('There was an error in the upload. The format or extension might not be supported.')
            );
      })
      .catch((err) => {
        if (fileSize >= THUMBNAIL_CDN_SIZE_LIMIT_BYTES) {
          uploadError(
            __('Thumbnail size over %max_size%MB, please edit and reupload.', {
              max_size: THUMBNAIL_CDN_SIZE_LIMIT_BYTES / (1024 * 1024),
            })
          );
        } else {
          uploadError(err.message);
        }
        setUploadStatus(STATUS.READY);
      });
  }

  // Note for translators: e.g. "Thumbnail  (1:1)"
  const label = `${__(assetName)} ${__(recommended)}`;
  const selectFileLabel = __('Select File');
  const selectedLabel = pathSelected ? __('URL Selected') : __('File Selected');

  let fileSelectorLabel;
  if (uploadStatus === STATUS.UPLOADING) {
    fileSelectorLabel = __('Uploading...');
  } else {
    // Include the same label/recommendation for both 'URL' and 'UPLOAD'.
    fileSelectorLabel = `${label} ${fileSelected || pathSelected ? __(selectedLabel) : __(selectFileLabel)}`;
  }
  const formBody = (
    <>
      <fieldset-section>
        {error && <div className="error__text">{error}</div>}
        {useUrl ? (
          <FormField
            autoFocus
            type={'text'}
            name={'thumbnail'}
            label={label}
            placeholder={`https://example.com/image.png`}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              onUpdate(e.target.value, !useUrl);
            }}
          />
        ) : (
          <FileSelector
            autoFocus
            disabled={uploadStatus === STATUS.UPLOADING}
            label={fileSelectorLabel}
            name="assetSelector"
            currentPath={pathSelected}
            onFileChosen={(file) => {
              if (file.name) {
                setFileSelected(file);
                setFileSize(file.size);
                // what why? why not target=WEB this?
                // file.path is undefined in web but available in electron
                setPathSelected(file.name || file.path);
              }
            }}
            accept={accept}
          />
        )}
      </fieldset-section>

      <div className="section__actions">
        {onDone && (
          <Button
            button="primary"
            type="submit"
            label={useUrl ? __('Done') : __('Upload')}
            disabled={!useUrl && (uploadStatus === STATUS.UPLOADING || !pathSelected || !fileSelected)}
            onClick={() => doUploadAsset()}
          />
        )}
        <FormField
          name="toggle-upload"
          type="checkbox"
          label={__('Use a URL')}
          checked={useUrl}
          onChange={() => setUseUrl(!useUrl)}
        />
      </div>
    </>
  );

  if (inline) {
    return <fieldset-section>{formBody}</fieldset-section>;
  }

  return (
    <Card
      title={title || __('Choose %asset%', { asset: __(`${assetName}`) })}
      actions={<Form onSubmit={onDone}>{formBody}</Form>}
    />
  );
}

export default SelectAsset;
