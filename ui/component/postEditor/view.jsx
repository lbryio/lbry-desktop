// @flow
import React, { useEffect } from 'react';
import { SIMPLE_SITE } from 'config';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import useFetchStreamingUrl from 'effects/use-fetch-streaming-url';

type Props = {
  uri: ?string,
  label: ?string,
  disabled: ?boolean,
  filePath: string | WebFile,
  fileText: ?string,
  fileMimeType: ?string,
  isStillEditing: boolean,
  setPrevFileText: string => void,
  updatePublishForm: ({}) => void,
  setCurrentFileType: string => void,
};

function PostEditor(props: Props) {
  const {
    uri,
    label,
    disabled,
    filePath,
    fileText,
    fileMimeType,
    isStillEditing,
    setPrevFileText,
    updatePublishForm,
    setCurrentFileType,
  } = props;

  const editing = isStillEditing && uri;

  const [ready, setReady] = React.useState(!editing);
  const [loading, setLoading] = React.useState(false);
  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-post-mode', false);
  const { streamingUrl } = useFetchStreamingUrl(uri);

  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  // Ready to edit content
  useEffect(() => {
    if (!ready && !loading && fileText && streamingUrl) {
      setReady(true);
    }
  }, [ready, loading, fileText, streamingUrl]);

  useEffect(() => {
    if (fileText && loading) {
      setLoading(false);
    } else if (!fileText && loading) {
      setLoading(true);
    }
  }, [fileText, loading, setLoading]);

  useEffect(() => {
    function readFileStream(url) {
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

    if (editing) {
      // Editing same file (previously published)
      // User can use a different file to replace the content
      if (!ready && !filePath && !fileText && streamingUrl && fileMimeType === 'text/markdown') {
        setCurrentFileType(fileMimeType);
        updateEditorText(streamingUrl);
      }
    }
  }, [
    ready,
    editing,
    fileText,
    filePath,
    fileMimeType,
    streamingUrl,
    setPrevFileText,
    updatePublishForm,
    setCurrentFileType,
  ]);

  return (
    <FormField
      type={!SIMPLE_SITE && advancedEditor ? 'markdown' : 'textarea'}
      name="content_post"
      label={label}
      placeholder={__('My content for this post...')}
      value={ready ? fileText : __('Loading...')}
      disabled={!ready || disabled}
      onChange={value => updatePublishForm({ fileText: advancedEditor ? value : value.target.value })}
      quickActionLabel={!SIMPLE_SITE && (advancedEditor ? __('Simple Editor') : __('Advanced Editor'))}
      quickActionHandler={toggleMarkdown}
      textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
    />
  );
}

export default PostEditor;
