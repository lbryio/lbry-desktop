// @flow
import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import PdfViewer from 'component/viewers/pdfViewer';
import ThreeViewer from 'component/viewers/threeViewer';
import DocumentViewer from 'component/viewers/documentViewer';
import DocxViewer from 'component/viewers/docxViewer';
import HtmlViewer from 'component/viewers/htmlViewer';

type Props = {
  mediaType: string,
  source: {
    fileName: string,
    fileType: string,
    downloadPath: string,
    stream: opts => void,
    blob: callback => void,
  },
  currentTheme: string,
};

class FileRender extends React.PureComponent<Props> {
  renderViewer() {
    const { source, mediaType, currentTheme } = this.props;

    // Extract relevant data to render file
    const { blob, stream, fileName, fileType, contentType, downloadPath } = source;

    // Human-readable files (scripts and plain-text files)
    const readableFiles = ['text', 'document', 'script'];

    // Supported mediaTypes
    const mediaTypes = {
      '3D-file': <ThreeViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      // Add routes to viewer...
    };

    // Supported fileType
    const fileTypes = {
      pdf: <PdfViewer source={downloadPath} />,
      docx: <DocxViewer source={downloadPath} />,
      html: <HtmlViewer source={downloadPath} />,
      // Add routes to viewer...
    };

    // Check for a valid fileType or mediaType
    let viewer = fileTypes[fileType] || mediaTypes[mediaType];

    // Check for Human-readable files
    if (!viewer && readableFiles.includes(mediaType)) {
      viewer = <DocumentViewer source={{ stream, fileType, contentType }} theme={currentTheme} />;
    }

    // Message Error
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
