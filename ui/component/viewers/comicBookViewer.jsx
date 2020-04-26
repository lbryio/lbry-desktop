// @flow
import * as React from 'react';
import Villain from 'villain-react';
import 'villain-react/dist/style.css';

type Props = {
  theme: string,
  source: string,
};

let workerUrl = 'webworkers/worker-bundle.js';

if (process.env.NODE_ENV !== 'production') {
  // Don't add a leading slash in production because electron treats it as an absolute path
  workerUrl = `/${workerUrl}`;
}

class ComicBookViewer extends React.PureComponent<Props> {
  render() {
    const { source } = this.props || {};
    // Archive source
    const file = `file://${source}`;
    // Villain options
    const opts = {
      theme: this.props.theme === 'dark' ? 'Dark' : 'Light',
      allowFullScreen: true,
      autoHideControls: false,
      allowGlobalShortcuts: true,
    };

    return (
      <div className="file-render__viewer  file-render__viewer--comic">
        <Villain source={file} className={'comic-viewer'} options={opts} workerUrl={workerUrl} />
      </div>
    );
  }
}

export default ComicBookViewer;
