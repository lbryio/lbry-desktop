// @flow
import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
//import ThreeViewer from 'component/threeViewer';

type Props = {
  mediaType: string,
  fileSource: {
    filePath: string,
    fileType: string,
  },
  currentTheme: string,
};

class FileRender extends React.PureComponent<Props> {
  constructor() {
    super();
  }

  routeViewer() {
    const { mediaType, fileSource, currentTheme } = this.props;

    if (!mediaType || !fileSource) return null;

    // Supported mediaTypes
    const mediaTypes = {
      // '3D-file': () => <ThreeViewer source={fileSource} theme={currentTheme}/>,
      // 'e-book': () => <EbookReader />,
      // 'comic-book' () => <ComicReader />,
      // Add routes to viewer...
    };

    // Return viewer
    return mediaType ? mediaTypes[mediaType] : null;
  }

  render() {
    const Viewer = this.routeViewer();
    const unsupportedMessage = "Sorry, looks like we can't preview this file.";

    return (
      <div className="file-render">
        {Viewer ? <Viewer /> : <LoadingScreen status={unsupportedMessage} spinner={false} />}
      </div>
    );
  }
}

export default FileRender;
