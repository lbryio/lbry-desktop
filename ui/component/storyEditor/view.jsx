// @flow
import fs from 'fs';
import React, { useEffect } from 'react';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';

type Props = {
  uri: ?string,
  label: ?string,
  disabled: ?boolean,
  fileInfo: FileListItem,
  filePath: string | WebFile,
  fileText: ?string,
  isStillEditing: boolean,
  setPrevFileText: string => void,
  updatePublishForm: ({}) => void,
};

function StoryEditor(props: Props) {
  const {
    uri,
    label,
    disabled,
    fileInfo,
    filePath,
    fileText,
    isStillEditing,
    setPrevFileText,
    updatePublishForm,
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

  return (
    <FormField
      type={advancedEditor ? 'markdown' : 'textarea'}
      name="content_story"
      label={label}
      placeholder={__('My content for this story...')}
      value={fileText}
      disabled={disabled}
      onChange={value => updatePublishForm({ fileText: advancedEditor ? value : value.target.value })}
      quickActionLabel={advancedEditor ? __('Simple Editor') : __('Advanced Editor')}
      quickActionHandler={toggleMarkdown}
      textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
    />
  );
}

export default StoryEditor;
