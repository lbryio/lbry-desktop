// @flow
import React from 'react';
import LoadingScreen from 'component/common/loading-screen';
import PdfViewer from 'component/viewers/pdfViewer';
import ThreeViewer from 'component/viewers/threeViewer';
import DocumentViewer from 'component/viewers/documentViewer';
import DocxViewer from 'component/viewers/docxViewer';
import HtmlViewer from 'component/viewers/htmlViewer';
import AudioVideoViewer from 'component/viewers/audioVideoViewer';

type Props = {
  mediaType: string,
  source: {
    stream: string => void,
    fileName: string,
    fileType: string,
    contentType: string,
    downloadPath: string,
  },
  currentTheme: string,
};

class FileRender extends React.PureComponent<Props> {
  renderViewer() {
    const { source, mediaType, currentTheme, poster } = this.props;

    // Extract relevant data to render file
    const { stream, fileType, contentType, downloadPath, fileName } = source;

    // Human-readable files (scripts and plain-text files)
    const readableFiles = ['text', 'document', 'script'];

    // Supported mediaTypes
    const mediaTypes = {
      '3D-file': <ThreeViewer source={{ fileType, downloadPath }} theme={currentTheme} />,
      video: (
        <AudioVideoViewer
          source={{ downloadPath, fileName }}
          contentType={contentType}
          poster={poster}
        />
      ),
      audio: <AudioVideoViewer source={{ downloadPath, fileName }} contentType={contentType} />,

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
