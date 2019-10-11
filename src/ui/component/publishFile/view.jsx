// @flow
import * as ICONS from 'constants/icons';
import React, { useState } from 'react';
import { regexInvalidURI } from 'lbry-redux';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';
import Spinner from 'component/spinner';

type Props = {
  name: ?string,
  filePath: string | WebFile,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
  publishing: boolean,
};

function PublishFile(props: Props) {
  const { name, balance, filePath, isStillEditing, updatePublishForm, disabled, publishing } = props;

  // This is basically for displaying the 500mb limit
  const [fileError, setFileError] = useState('');

  let currentFile = '';
  if (filePath) {
    if (typeof filePath === 'string') {
      currentFile = filePath;
    } else {
      currentFile = filePath.name;
    }
  }

  function handleFileChange(file: WebFile) {
    // if electron, we'll set filePath to the path string because SDK is handling publishing.
    // if web, we set the filePath (dumb name) to the File() object
    // File.path will be undefined from web due to browser security, so it will default to the File Object.

    // @if TARGET='web'
    // we only need to enforce file sizes on 'web'
    const PUBLISH_SIZE_LIMIT: number = 512000000;
    if (typeof file !== 'string') {
      if (file && file.size && Number(file.size) > PUBLISH_SIZE_LIMIT) {
        setFileError('File uploads currently limited to 500MB. Download the app for unlimited publishing.');
        updatePublishForm({ filePath: '', name: '' });
        return;
      } else {
        setFileError('');
      }
    }
    // @endif
    const publishFormParams: { filePath: string | WebFile, name?: string } = {
      filePath: file.path || file,
      name: file.name,
    };
    const parsedFileName = file.name.replace(regexInvalidURI, '');
    publishFormParams.name = parsedFileName.replace(' ', '-');
    updatePublishForm(publishFormParams);
  }

  let title;
  if (publishing) {
    title = (
      <span>
        {__('Publishing')}
        <Spinner type={'small'} />
      </span>
    );
  } else {
    title = isStillEditing ? __('Edit') : __('Publish');
  }
  return (
    <Card
      icon={ICONS.PUBLISH}
      disabled={disabled || balance === 0}
      title={title}
      subtitle={
        isStillEditing ? __('You are currently editing a claim.') : __('Publish something totally wacky and wild.')
      }
      actions={
        <React.Fragment>
          <FileSelector
            disabled={disabled}
            currentPath={currentFile}
            onFileChosen={handleFileChange}
            error={fileError}
          />
          {!isStillEditing && (
            <p className="help">
              {__('For video content, use MP4s in H264/AAC format for best compatibility.')}{' '}
              <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/how-to-publish" />.
            </p>
          )}
          {!!isStillEditing && name && (
            <p className="help">
              {__("If you don't choose a file, the file from your existing claim %name% will be used", { name: name })}
            </p>
          )}
        </React.Fragment>
      }
    />
  );
}

export default PublishFile;
