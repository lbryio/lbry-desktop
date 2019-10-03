// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { regexInvalidURI } from 'lbry-redux';
import FileSelector from 'component/common/file-selector';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  name: ?string,
  filePath: ?string,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
};

function PublishFile(props: Props) {
  const { name, balance, filePath, isStillEditing, updatePublishForm, disabled } = props;

  function handleFileChange(filePath: string, fileName: string) {
    const publishFormParams: { filePath: string, name?: string } = { filePath };

    if (!name) {
      const parsedFileName = fileName.replace(regexInvalidURI, '');
      publishFormParams.name = parsedFileName.replace(' ', '-');
    }

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
          <FileSelector currentPath={filePath} onFileChosen={handleFileChange} />
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
