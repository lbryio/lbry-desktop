// @flow

import React from 'react';
import mammoth from 'mammoth';
import Breakdance from 'breakdance';
import LoadingScreen from 'component/common/loading-screen';
import MarkdownPreview from 'component/common/markdown-preview';

type Props = {
  source: {
    fileType: string,
    filePath: string,
    downloadPath: string,
  },
};

class DocxViewer extends React.PureComponent<Props> {
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

    const options = {
      styleMap: [
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
        "p[style-name='Aside Heading'] => div.aside > h2:fresh",
        "p[style-name='Aside Text'] => div.aside > p:fresh",
      ],
    };
    mammoth
      .convertToHtml({ path: source.downloadPath }, options)
      .then(result => {
        const breakdance = new Breakdance({ omit: ['table', 'img'] });
        const markdown = breakdance.render(result.value);
        this.setState({ content: markdown, loading: false });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      })
      .done();
  }

  render() {
    const { content, error, loading } = this.state;
    const loadingMessage = __('Rendering document.');

    return (
      <div className="document-viewer file-render__viewer">
        {loading && <LoadingScreen status={loadingMessage} spinner />}
        {error && <LoadingScreen status={error} spinner={false} />}
        {content && (
          <div className="document-viewer__content">
            <MarkdownPreview content={content} promptLinks />
          </div>
        )}
      </div>
    );
  }
}

export default DocxViewer;
