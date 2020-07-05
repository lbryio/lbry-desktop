// @flow
import fs from 'fs';
import React, { useEffect } from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import usePersistedState from 'effects/use-persisted-state';
import * as ICONS from 'constants/icons';

type Props = {
  uri: ?string,
  title: ?string,
  fileInfo: FileListItem,
  filePath: string | WebFile,
  fileText: ?string,
  name: ?string,
  isStillEditing: boolean,
  balance: number,
  updatePublishForm: ({}) => void,
  disabled: boolean,
  publishing: boolean,
  showToast: string => void,
  setPrevFileText: string => void,
  inProgress: boolean,
  clearPublish: () => void,
  ffmpegStatus: any,
  optimize: boolean,
  size: number,
  duration: number,
  isVid: boolean,
};

function PublishStory(props: Props) {
  const {
    uri,
    name,
    title,
    balance,
    fileInfo,
    filePath,
    fileText,
    isStillEditing,
    updatePublishForm,
    disabled,
    publishing,
    inProgress,
    clearPublish,
    size,
    setPrevFileText,
  } = props;

  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-story-mode', false);

  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  useEffect(() => {
    // @if TARGET='app'
    function readFile(path) {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (error, data) => {
          error ? reject(error) : resolve(data);
        });
      });
    }

    async function updateEditorText(path) {
      const text = await readFile(path);
      if (text) {
        // Store original content
        setPrevFileText(text);
        // Update text editor form
        updatePublishForm({ fileText: text });
      }
    }

    const isEditingFile = isStillEditing && uri && fileInfo;

    if (isEditingFile) {
      const { mime_type: mimeType, download_path: downloadPath } = fileInfo;

      // Editing same file (previously published)
      // User can use a different file to replace the content
      if (!filePath && mimeType === 'text/markdown') {
        updateEditorText(downloadPath);
      }
    }

    // @endif
  }, [uri, isStillEditing, filePath, fileInfo, setPrevFileText, updatePublishForm]);

  let cardTitle;
  if (publishing) {
    cardTitle = (
      <span>
        {__('Publishing')}
        <Spinner type={'small'} />
      </span>
    );
  } else {
    cardTitle = isStillEditing ? __('Edit') : __('Publish');
  }

  return (
    <Card
      icon={ICONS.STORY}
      disabled={disabled || balance === 0}
      title={
        <React.Fragment>
          {cardTitle}{' '}
          {inProgress && <Button button="close" label={__('Cancel')} icon={ICONS.REMOVE} onClick={clearPublish} />}
        </React.Fragment>
      }
      subtitle={isStillEditing ? __('You are currently editing a claim.') : __('Write a totally wacky and wild story.')}
      actions={
        <React.Fragment>
          <FormField
            type="text"
            name="content_title"
            label={__('Title')}
            placeholder={__('Titular Title')}
            disabled={disabled}
            value={title}
            onChange={e => {
              updatePublishForm({ title: e.target.value });
            }}
          />
          <FormField
            type={advancedEditor ? 'markdown' : 'textarea'}
            name="content_story"
            label={__('Story content')}
            placeholder={__('My description for this and that')}
            value={fileText}
            disabled={disabled}
            onChange={value => updatePublishForm({ fileText: advancedEditor ? value : value.target.value })}
            quickActionLabel={advancedEditor ? __('Simple Editor') : __('Advanced Editor')}
            quickActionHandler={toggleMarkdown}
            textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
          />
        </React.Fragment>
      }
    />
  );
}

export default PublishStory;
