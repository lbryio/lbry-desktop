// @flow

import React, { useState } from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import { SPEECH_URLS } from 'lbry-redux';
import uuid from 'uuid/v4';

const accept = '.png, .jpg, .jpeg, .gif';

const SOURCE_URL = 'url';
const SOURCE_UPLOAD = 'upload';
const SPEECH_READY = 'READY';
const SPEECH_UPLOADING = 'UPLOADING';
type Props = {
  assetName: string,
  currentValue: ?string,
  onUpdate: string => void,
  recommended: string,
};

function SelectAsset(props: Props) {
  const { onUpdate, assetName, currentValue, recommended } = props;
  const [assetSource, setAssetSource] = useState(SOURCE_URL);
  const [pathSelected, setPathSelected] = useState('');
  const [fileSelected, setFileSelected] = useState('');
  const [uploadStatus, setUploadStatus] = useState(SPEECH_READY);

  function doUploadAsset(file) {
    const uploadError = (error = '') => {
      console.log('error', error);
    };

    const setUrl = path => {
      setUploadStatus(SPEECH_READY);
      onUpdate(path);
      setAssetSource(SOURCE_URL);
    };

    setUploadStatus(SPEECH_UPLOADING);

    const data = new FormData();
    const name = uuid();
    data.append('name', name);
    data.append('file', file);

    return fetch(SPEECH_URLS.SPEECH_PUBLISH, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(json => (json.success ? setUrl(`${json.data.serveUrl}`) : uploadError(json.message)))
      .catch(err => uploadError(err.message));
  }
  return (
    <fieldset-section>
      <fieldset-group className="fieldset-group--smushed">
        <FormField
          type="select"
          name={assetName}
          value={assetSource}
          onChange={e => setAssetSource(e.target.value)}
          label={__(assetName + ' source')}
        >
          <option key={'lmmnop'} value={'url'}>
            URL
          </option>
          <option key={'lmmnopq'} value={'upload'}>
            UPLOAD
          </option>
        </FormField>
        {assetSource === SOURCE_UPLOAD && (
          <>
            {!pathSelected && (
              <FileSelector
                label={'File to upload'}
                name={'assetSelector'}
                onFileChosen={file => {
                  if (file.name) {
                    setPathSelected(file.path);
                    setFileSelected(file);
                  }
                }}
                accept={accept}
              />
            )}
            {pathSelected && (
              <div>
                {`...${pathSelected.slice(-18)}`} {uploadStatus}{' '}
                <Button button={'primary'} onClick={() => doUploadAsset(fileSelected)}>
                  Upload
                </Button>{' '}
                <Button
                  button={'secondary'}
                  onClick={() => {
                    setPathSelected('');
                    setFileSelected('');
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </>
        )}
        {assetSource === SOURCE_URL && (
          <FormField
            type={'text'}
            name={'thumbnail'}
            label={__(assetName + ' ' + recommended)}
            placeholder={__('https://example.com/image.png')}
            disabled={false}
            value={currentValue}
            onChange={e => {
              onUpdate(e.target.value);
            }}
          />
        )}
      </fieldset-group>
    </fieldset-section>
  );
}

export default SelectAsset;
