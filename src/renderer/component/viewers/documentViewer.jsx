// @flow

import React from 'react';
import fs from 'fs';
import LoadingScreen from 'component/common/loading-screen';
import CodeViewer from 'component/viewers/codeViewer';
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
      this.setState({ content: data, loading: false });
    });

    stream.on('error', error => {
      this.setState({ error });
    });
  }

  renderDocument() {
    let viewer = null;
    const { source } = this.props;
    const { content, error } = this.state;
    const isReady = content && !error;
    const markdownType = ['md', 'markdown'];

    if (isReady && markdownType.includes(source.fileType)) {
      // Render markdown
      viewer = <MarkdownPreview content={content} promptLinks />;
    } else if (isReady) {
      // Render plain text
      viewer = <CodeViewer value={content} />;
    }

    return viewer;
  }

  render() {
    const { error, loading } = this.state;
    const loadingMessage = __('Rendering document.');
    const errorMessage = __("Sorry looks like we can't load the document.");

    return (
      <div className="file-render__viewer document-viewer">
        {loading && !error && <LoadingScreen status={loadingMessage} spinner />}
        {error && <LoadingScreen status={errorMessage} spinner={false} />}
        {this.renderDocument()}
      </div>
    );
  }
}

export default DocumentViewer;
