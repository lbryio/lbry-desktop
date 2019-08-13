// @flow

import React, { Suspense } from 'react';
import LoadingScreen from 'component/common/loading-screen';
import MarkdownPreview from 'component/common/markdown-preview';

const LazyCodeViewer = React.lazy<*>(() =>
  import(
    /* webpackChunkName: "codeViewer" */
    'component/viewers/codeViewer'
  )
);

type Props = {
  theme: string,
  source: {
    stream: string => any,
    fileType: string,
    contentType: string,
  },
};

type State = {
  error: boolean,
  loading: boolean,
  content: ?string,
};

class DocumentViewer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      content: null,
    };
  }

  componentDidMount() {
    const { source } = this.props;

    if (source && source.stream) {
      const stream = source.stream('utf8');

      let data = '';

      stream.on('data', chunk => {
        data += chunk;
      });

      stream.on('end', () => {
        this.setState({ content: data, loading: false });
      });

      stream.on('error', () => {
        this.setState({ error: true, loading: false });
      });
    }
  }

  renderDocument() {
    let viewer = null;
    const { content } = this.state;
    const { source, theme } = this.props;
    const { fileType, contentType } = source;
    const markdownType = ['md', 'markdown'];

    if (markdownType.includes(fileType)) {
      // Render markdown
      viewer = <MarkdownPreview content={content} promptLinks />;
    } else {
      // Render plain text
      viewer = <LazyCodeViewer value={content} contentType={contentType} theme={theme} />;
    }

    return viewer;
  }

  render() {
    const { error, loading, content } = this.state;
    const isReady = content && !error;
    const loadingMessage = __('Rendering document.');
    const errorMessage = __("Sorry, looks like we can't load the document.");

    return (
      <div className="file-render__viewer--document">
        {loading && !error && <LoadingScreen status={loadingMessage} spinner />}
        {error && <LoadingScreen status={errorMessage} spinner={!error} />}
        {isReady && <Suspense fallback={<div />}>{this.renderDocument()}</Suspense>}
      </div>
    );
  }
}

export default DocumentViewer;
