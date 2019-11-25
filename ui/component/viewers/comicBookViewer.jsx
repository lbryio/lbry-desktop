// @flow
import * as React from 'react';
import Villain from 'villain-react';
import 'villain-react/dist/style.css';

type Props = {
  theme: string,
  source: {
    fileType: string,
    downloadPath: string,
  },
};

let workerUrl = 'webworkers/worker-bundle.js';

if (process.env.NODE_ENV !== 'production') {
  // Don't add a leading slash in production because electron treats it as an absolute path
  workerUrl = `/${workerUrl}`;
}

class ComicBookViewer extends React.PureComponent<Props> {
  render() {
    const { downloadPath } = this.props.source || {};
    // Archive source
    const file = `file://${downloadPath}`;
    // Villain options
    const opts = {
      theme: this.props.theme === 'dark' ? 'Dark' : 'Light',
      allowFullScreen: true,
      autoHideControls: false,
      allowGlobalShortcuts: true,
    };

    return <Villain file={file} style={{ width: '100%', height: '100%' }} options={opts} workerUrl={workerUrl} />;
  }
}

export default ComicBookViewer;
