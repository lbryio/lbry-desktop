// @flow
import React, { useEffect } from 'react';
import { SIMPLE_SITE } from 'config';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  uri: ?string,
  label: ?string,
  disabled: ?boolean,
  fileInfo: FileListItem,
  filePath: string | WebFile,
  fileText: ?string,
  streamingUrl: ?string,
  isStillEditing: boolean,
  setPrevFileText: string => void,
  updatePublishForm: ({}) => void,
  setCurrentFileType: string => void,
};

function StoryEditor(props: Props) {
  const {
    uri,
    label,
    disabled,
    fileInfo,
    filePath,
    fileText,
    streamingUrl,
    isStillEditing,
    setPrevFileText,
    updatePublishForm,
    setCurrentFileType,
  } = props;

  const [isLoadign, setIsLoadign] = React.useState(false);
  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-story-mode', false);

  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  useEffect(() => {
    if (fileText && isLoadign) {
      setIsLoadign(false);
    }
  }, [fileText, isLoadign, setIsLoadign]);

  useEffect(() => {
    function readFileStream(url) {
      setIsLoadign(true);
      return fetch(url).then(res => res.text());
    }

    async function updateEditorText(url) {
      try {
        const text = await readFileStream(url);
        if (text) {
          // Store original content
          setPrevFileText(text);
          // Update text editor form
          updatePublishForm({ fileText: text });
        }
      } catch (error) {
        // Handle error..
      }
    }

    const isEditingFile = isStillEditing && uri && fileInfo;

    if (isEditingFile) {
      const { mime_type: mimeType } = fileInfo;
      // Editing same file (previously published)
      // User can use a different file to replace the content
      if (!filePath && streamingUrl && mimeType === 'text/markdown') {
        setCurrentFileType(mimeType);
        updateEditorText(streamingUrl);
      }
    }
  }, [uri, isStillEditing, filePath, fileInfo, setPrevFileText, updatePublishForm, streamingUrl, setCurrentFileType]);

  return (
    <FormField
      type={!SIMPLE_SITE && advancedEditor ? 'markdown' : 'textarea'}
      name="content_story"
      label={label}
      placeholder={isLoadign ? __('Loadign...') : __('My content for this story...')}
      value={fileText}
      disabled={isLoadign || disabled}
      onChange={value => updatePublishForm({ fileText: advancedEditor ? value : value.target.value })}
      quickActionLabel={!SIMPLE_SITE && (advancedEditor ? __('Simple Editor') : __('Advanced Editor'))}
      quickActionHandler={toggleMarkdown}
      textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
    />
  );
}

export default StoryEditor;
