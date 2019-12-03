// @flow

import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import MarkdownPreview from 'component/common/markdown-preview';
import CodeViewer from 'component/viewers/codeViewer';
import * as https from 'https';

type Props = {
  theme: string,
  source: {
    file: (?string) => any,
    stream: string,
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
    // @if TARGET='app'
    if (source && source.file) {
      const stream = source.file('utf8');

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
    // @endif
    // @if TARGET='web'
    if (source && source.stream) {
      https.get(
        source.stream,
        function(response) {
          if (response.statusCode === 200) {
            let data = '';
            response.on('data', function(chunk) {
              data += chunk;
            });
            response.on(
              'end',
              function() {
                this.setState({ content: data, loading: false });
              }.bind(this)
            );
          } else {
            this.setState({ error: true, loading: false });
          }
        }.bind(this)
      );
    }
    // @endif
  }

  renderDocument() {
    let viewer = null;
    const { content } = this.state;
    const { source, theme } = this.props;
    const { fileType, contentType } = source;
    const markdownType = ['md', 'markdown'];
    if (markdownType.includes(fileType) || contentType === 'text/markdown' || contentType === 'text/md') {
      // Render markdown
      viewer = <MarkdownPreview content={content} />;
    } else {
      // Render plain text
      viewer = <CodeViewer value={content} contentType={contentType} theme={theme} />;
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
        {isReady && this.renderDocument()}
      </div>
    );
  }
}

export default DocumentViewer;
