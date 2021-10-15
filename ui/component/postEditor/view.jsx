// @flow
import React, { useEffect } from 'react';
import { FormField } from 'component/common/form';

type Props = {
  uri: ?string,
  label: ?string,
  disabled: ?boolean,
  filePath: string | WebFile,
  fileText: ?string,
  fileMimeType: ?string,
  streamingUrl: ?string,
  isStillEditing: boolean,
  fetchStreamingUrl: (string) => void,
  setPrevFileText: (string) => void,
  updatePublishForm: ({}) => void,
  setCurrentFileType: (string) => void,
};

function PostEditor(props: Props) {
  const {
    uri,
    label,
    disabled,
    filePath,
    fileText,
    streamingUrl,
    fileMimeType,
    isStillEditing,
    setPrevFileText,
    fetchStreamingUrl,
    updatePublishForm,
    setCurrentFileType,
  } = props;

  const editing = isStillEditing && uri;

  const [ready, setReady] = React.useState(!editing);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (editing && uri) {
      fetchStreamingUrl(uri);
    }
  }, [uri, editing, fetchStreamingUrl]);

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
      return fetch(url).then((res) => res.text());
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
        console.error(error); // eslint-disable-line
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
      type={'markdown'}
      name="content_post"
      label={label}
      placeholder={__('My content for this post...')}
      value={ready ? fileText : __('Loading...')}
      disabled={!ready || disabled}
      onChange={(value) => updatePublishForm({ fileText: value })}
    />
  );
}

export default PostEditor;
