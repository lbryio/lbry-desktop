// @flow

import React from 'react';
import fs from 'fs';
import LoadingScreen from 'component/common/loading-screen';
import MarkdownPreview from 'component/common/markdown-preview';

type Props = {
  source: {
    fileType: string,
    filePath: string,
    downloadPath: string,
  },
};

class DocumentViewer extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      content: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { source } = this.props;
    const stream = fs.createReadStream(source.downloadPath, 'utf8');

    let data = '';

    stream.on('data', chunk => {
      data += chunk;
    });

    stream.on('end', () => {
      this.setState({ content: data });
    });

    stream.on('error', error => {
      this.setState({ error });
    });
  }

  renderDocument(data) {
    const { source } = this.props;
    const { fileType } = source;

    // Match supported documents
    const docs = {
      md: content => <MarkdownPreview content={content} promptLinks />,
    };

    if (docs[fileType]) {
      // Use custom parser
      return docs[fileType](data);
    }
    // Render plain text
    this.setState({ loading: false });
    return <textarea disabled="true" value={data} />;
  }

  render() {
    const { content, error, loading } = this.state;
    const loadingMessage = __('Rendering document.');
    const errorMessage = __("Sorry looks like we can't load the document.");

    return (
      <div className="document-viewer file-render__viewer">
        {loading && !error && <LoadingScreen status={loadingMessage} spinner />}
        {error && <LoadingScreen status={errorMessage} spinner={false} />}
        {content && (
          <div className="document-viewer__content">{content && this.renderDocument(content)}</div>
        )}
      </div>
    );
  }
}

export default DocumentViewer;
