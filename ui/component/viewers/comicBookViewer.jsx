// @flow
import * as React from 'react';
import Villain from 'villain';
import 'villain/dist/style.css';

type Props = {
  source: {
    fileType: string,
    downloadPath: string,
  },
};

let workerPath = 'webworkers/worker-bundle.js';
if (process.env.NODE_ENV !== 'production') {
  // Don't add a leading slash in production because electron treats it as an absolute path
  workerPath = `/${workerPath}`;
}

const opts = {
  workerPath,
  allowFullScreen: false,
  autoHideControls: true,
};

class ComicBookViewer extends React.PureComponent<Props> {
  render() {
    const { downloadPath } = this.props.source || {};
    const file = `file://${downloadPath}`;

    return <Villain file={file} width={'100%'} height={'100%'} options={opts} />;
  }
}

export default ComicBookViewer;
