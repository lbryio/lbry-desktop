// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { regexInvalidURI } from 'lbry-redux';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  name: ?string,
  filePath: string | WebFile,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
};

function PublishFile(props: Props) {
  const { name, balance, filePath, isStillEditing, updatePublishForm, disabled } = props;

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
    // file.path will be undefined from web due to browser security, so it will default to the File Object.
    const publishFormParams: { filePath: string | WebFile, name?: string } = {
      filePath: file.path || file,
      name: file.name,
    };
    const parsedFileName = file.name.replace(regexInvalidURI, '');

    publishFormParams.name = parsedFileName.replace(' ', '-');

    updatePublishForm(publishFormParams);
  }

  return (
    <Card
      icon={ICONS.PUBLISH}
      disabled={disabled || balance === 0}
      title={isStillEditing ? __('Edit') : __('Publish')}
      subtitle={
        isStillEditing ? __('You are currently editing a claim.') : __('Publish something totally wacky and wild.')
      }
      actions={
        <React.Fragment>
          <FileSelector currentPath={currentFile} onFileChosen={handleFileChange} />
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
