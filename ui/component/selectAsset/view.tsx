import React from 'react';
import FileSelector from 'component/common/file-selector';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import { uploadImage } from 'util/upload-image';
import usePersistedState from 'effects/use-persisted-state';

const accept = '.png, .jpg, .jpeg, .gif';
const SPEECH_READY = 'READY';
const SPEECH_UPLOADING = 'UPLOADING';

type Props = {
  assetName: string,
  currentValue: string | null | undefined,
  onUpdate: (arg1: string, arg2: boolean, arg3?: string | null | undefined) => void,
  recommended: string,
  title: string,
  onDone?: () => void,
  inline?: boolean,
  // When uploading pictures, the upload service
  // can return success but the image isn't ready
  // to be displayed yet. This is when a local preview
  // comes in handy. The preview (base 64) will be
  // passed to the onUpdate function after the
  // upload service returns success.
  buildImagePreview?: boolean,
  // File extension filtering. Files can be filtered
  // but the "All Files" options always shows up. To
  // avoid that, you can use the filters property.
  // For example, to only accept images pass the
  // following filter:
  // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
  filters?: Array<{
    name: string,
    extension: string[]
  }>,
  type?: string
};

function filePreview(file: unknown) {
  return new Promise((resolve: unknown) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result.toString());
    };
    reader.onerror = () => {
      resolve(undefined);
    };
    reader.readAsDataURL(file);
  });
}

function SelectAsset(props: Props) {
  const { onUpdate, onDone, assetName, currentValue, recommended, title, inline, buildImagePreview, filters, type } =
    props;
  const [pathSelected, setPathSelected] = React.useState('');
  const [fileSelected, setFileSelected] = React.useState<any>(null);
  const [uploadStatus, setUploadStatus] = React.useState(SPEECH_READY);
  const [useUrl, setUseUrl] = usePersistedState('thumbnail-upload:mode', false);
  const [url, setUrl] = React.useState(currentValue);
  const [error, setError] = React.useState<any>();

  function doUploadAsset() {
    const uploadError = (error = '') => {
      setError(error);
    };

    const onSuccess = async (thumbnailUrl: unknown) => {
      let preview;
      setUploadStatus(SPEECH_READY);

      if (buildImagePreview) {
        preview = await filePreview(fileSelected);
      }

      onUpdate(thumbnailUrl, !useUrl, preview);

      if (onDone) {
        onDone();
      }
    };

    setUploadStatus(SPEECH_UPLOADING);

    return uploadImage(fileSelected)
      .then(onSuccess)
      .catch((err) => {
        uploadError(err.message);
        setUploadStatus(SPEECH_READY);
      });
  }

  // Note for translators: e.g. "Thumbnail  (1:1)"
  const label = `${__(assetName)} ${__(recommended)}`;
  const selectFileLabel = __('Select File');
  const selectedLabel = pathSelected ? __('URL Selected') : __('File Selected');

  let fileSelectorLabel;
  if (uploadStatus === SPEECH_UPLOADING) {
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
            filters={filters}
            type={type}
            autoFocus
            disabled={uploadStatus === SPEECH_UPLOADING}
            label={fileSelectorLabel}
            name="assetSelector"
            currentPath={pathSelected}
            onFileChosen={(fileWithPath) => {
              if (fileWithPath.file.name) {
                setFileSelected(fileWithPath.file);
                setPathSelected(fileWithPath.path);
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
            disabled={!useUrl && (uploadStatus === SPEECH_UPLOADING || !pathSelected || !fileSelected)}
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
