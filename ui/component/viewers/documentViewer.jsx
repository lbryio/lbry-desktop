// @flow

import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import MarkdownPreview from 'component/common/markdown-preview';
import CodeViewer from 'component/viewers/codeViewer';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as https from 'https';

type Props = {
  theme: string,
  renderMode: string,
  source: {
    file: (?string) => any,
    stream: string,
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

      stream.on('data', (chunk) => {
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
      https.get(source.stream, (response) => {
        if (response.statusCode === 200) {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            this.setState({ content: data, loading: false });
          });
        } else {
          this.setState({ error: true, loading: false });
        }
      });
    }
    // @endif
  }

  renderDocument() {
    const { content } = this.state;
    const { source, theme, renderMode } = this.props;
    const { contentType } = source;

    return renderMode === RENDER_MODES.MARKDOWN ? (
      <MarkdownPreview content={content} isMarkdownPost promptLinks />
    ) : (
      <CodeViewer value={content} contentType={contentType} theme={theme} />
    );
  }

  render() {
    const { error, content } = this.state;
    const isReady = content && !error;
    const errorMessage = __("Sorry, looks like we can't load the document.");

    return (
      <div className="file-viewer file-viewer--document">
        {error && <LoadingScreen status={errorMessage} spinner={!error} />}
        {isReady && this.renderDocument()}
      </div>
    );
  }
}

export default DocumentViewer;
