// @flow

import React, { useState } from 'react';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import { SPEECH_URLS } from 'lbry-redux';
import uuid from 'uuid/v4';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../common/tabs';

const accept = '.png, .jpg, .jpeg, .gif';
const SPEECH_READY = 'READY';
const SPEECH_UPLOADING = 'UPLOADING';

const URL_INDEX = 0;

type Props = {
  assetName: string,
  currentValue: ?string,
  onUpdate: string => void,
  recommended: string,
};

function SelectAsset(props: Props) {
  const { onUpdate, assetName, currentValue, recommended } = props;
  const [asset, setAsset] = useState(currentValue);
  const [pathSelected, setPathSelected] = useState('');
  const [fileSelected, setFileSelected] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState(SPEECH_READY);
  const [error, setError] = useState();
  const [tabIndex, setTabIndex] = useState(URL_INDEX);

  function doUploadAsset(file) {
    const uploadError = (error = '') => {
      setError(error);
    };

    const setUrl = path => {
      setUploadStatus(SPEECH_READY);
      onUpdate(path);
      setAsset(path);
      setTabIndex(URL_INDEX);
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
      <Tabs onChange={n => setTabIndex(n)} index={tabIndex}>
        <TabList className="tabs__list--select-asset">
          <Tab>{__('Url')}</Tab>
          <Tab>{__('Upload')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormField
              type={'text'}
              name={'thumbnail'}
              label={__(assetName + ' ' + recommended)}
              placeholder={'https://example.com/image.png'}
              disabled={false}
              value={asset}
              onChange={e => {
                onUpdate(e.target.value);
              }}
            />
          </TabPanel>
          <TabPanel>
            <div>
              {error && <div className="error__text">{error}</div>}
              {!pathSelected && (
                <FileSelector
                  label={'File to upload'}
                  name={'assetSelector'}
                  onFileChosen={file => {
                    if (file.name) {
                      setPathSelected(file.path || file.name);
                      setFileSelected(file);
                    }
                  }}
                  accept={accept}
                />
              )}
              {pathSelected && (
                <div>
                  <FormField
                    type={'text'}
                    name={'uploaded_thumbnail'}
                    label={''}
                    placeholder={'https://example.com/image.png'}
                    disabled={false}
                    value={`${pathSelected}`}
                  />
                  <div>
                    <Button button={'primary'} onClick={() => doUploadAsset(fileSelected)}>
                      Upload
                    </Button>
                    <Button
                      button={'secondary'}
                      onClick={() => {
                        setPathSelected('');
                        setFileSelected(null);
                        setError(null);
                      }}
                    >
                      Clear
                    </Button>
                    {uploadStatus}
                  </div>
                </div>
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </fieldset-section>
  );
}

export default SelectAsset;
