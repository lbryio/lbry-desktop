// @flow
import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import PdfViewer from 'component/viewers/pdfViewer';

type Props = {
  mediaType: string,
  source: {
    filePath: string,
    fileType: string,
    downloadPath: string,
  },
  currentTheme: string,
};

class FileRender extends React.PureComponent<Props> {
  renderViewer() {
    const { source, mediaType, currentTheme } = this.props;
    const viewerProps = { source, theme: currentTheme };

    // Supported mediaTypes
    const mediaTypes = {
      // '3D-file':  <ThreeViewer {...viewerProps}/>,
      // Add routes to viewer...
    };

    // Supported fileType
    const fileTypes = {
      pdf: <PdfViewer {...viewerProps} />,
      // Add routes to viewer...
    };

    const { fileType } = source;
    const viewer = mediaType && source && (mediaTypes[mediaType] || fileTypes[fileType]);
    const unsupportedMessage = __("Sorry, looks like we can't preview this file.");
    const unsupported = <LoadingScreen status={unsupportedMessage} spinner={false} />;

    // Return viewer
    return viewer || unsupported;
  }

  render() {
    return <div className="file-render">{this.renderViewer()}</div>;
  }
}

export default FileRender;
