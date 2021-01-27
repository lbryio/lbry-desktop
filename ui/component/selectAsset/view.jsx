// @flow

import React from 'react';
import FileSelector from 'component/common/file-selector';
import { SPEECH_URLS } from 'lbry-redux';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import { generateThumbnailName } from 'util/generate-thumbnail-name';
import usePersistedState from 'effects/use-persisted-state';

const accept = '.png, .jpg, .jpeg, .gif';
const SPEECH_READY = 'READY';
const SPEECH_UPLOADING = 'UPLOADING';

type Props = {
  assetName: string,
  currentValue: ?string,
  onUpdate: string => void,
  recommended: string,
  title: string,
  onDone?: () => void,
};

function SelectAsset(props: Props) {
  const { onUpdate, onDone, assetName, recommended, title } = props;
  const [pathSelected, setPathSelected] = React.useState('');
  const [fileSelected, setFileSelected] = React.useState<any>(null);
  const [uploadStatus, setUploadStatus] = React.useState(SPEECH_READY);
  const [useUrl, setUseUrl] = usePersistedState('thumbnail-upload:mode', false);
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState();

  React.useEffect(() => {
    if (pathSelected && fileSelected) {
      doUploadAsset();
    }
  }, [pathSelected, fileSelected]);

  function doUploadAsset() {
    const uploadError = (error = '') => {
      setError(error);
    };

    const onSuccess = thumbnailUrl => {
      setUploadStatus(SPEECH_READY);
      onUpdate(thumbnailUrl);

      if (onDone) {
        onDone();
      }
    };

    setUploadStatus(SPEECH_UPLOADING);

    const data = new FormData();
    const name = generateThumbnailName();
    data.append('name', name);
    data.append('file', fileSelected);

    return fetch(SPEECH_URLS.SPEECH_PUBLISH, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(json => (json.success ? onSuccess(`${json.data.serveUrl}`) : uploadError(json.message)))
      .catch(err => {
        uploadError(err.message);
        setUploadStatus(SPEECH_READY);
      });
  }

  // Note for translators: e.g. "Thumbnail  (1:1)"
  const label = __('%image_type%  %recommended_ratio%', { image_type: assetName, recommended_ratio: recommended });

  let fileSelectorLabel;
  if (uploadStatus === SPEECH_UPLOADING) {
    fileSelectorLabel = __('Uploading...');
  } else {
    // Include the same label/recommendation for both 'URL' and 'UPLOAD'.
    fileSelectorLabel = __('%label% • File to upload', { label: label });
  }

  return (
    <Card
      title={title || __('Choose image')}
      actions={
        <Form onSubmit={onDone}>
          {error && <div className="error__text">{error}</div>}
          {useUrl ? (
            <FormField
              autoFocus
              type={'text'}
              name={'thumbnail'}
              label={label}
              placeholder={'https://example.com/image.png'}
              value={url}
              onChange={e => {
                setUrl(e.target.value);
                onUpdate(e.target.value);
              }}
            />
          ) : (
            <FileSelector
              autoFocus
              disabled={uploadStatus === SPEECH_UPLOADING}
              label={fileSelectorLabel}
              name="assetSelector"
              currentPath={pathSelected}
              onFileChosen={file => {
                if (file.name) {
                  setFileSelected(file);
                  // file.path is undefined in web but available in electron
                  setPathSelected(file.name || file.path);
                }
              }}
              accept={accept}
            />
          )}

          <div className="section__actions">
            {onDone && (
              <Button button="primary" type="submit" label={__('Done')} disabled={uploadStatus === SPEECH_UPLOADING} />
            )}
            <FormField
              name="toggle-upload"
              type="checkbox"
              label={__('Use a URL')}
              checked={useUrl}
              onChange={() => setUseUrl(!useUrl)}
            />
          </div>
        </Form>
      }
    />
  );
}

export default SelectAsset;
