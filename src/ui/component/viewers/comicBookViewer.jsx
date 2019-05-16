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

const opts = {
  workerPath: '/webworkers/worker-bundle.js',
};

class ComicBookViewer extends React.PureComponent<Props> {
  render() {
    const { downloadPath } = this.props.source || {};
    const file = `file://${downloadPath}`;

    return <Villain file={file} width={'100%'} height={'100%'} options={opts} />;
  }
}

export default ComicBookViewer;
