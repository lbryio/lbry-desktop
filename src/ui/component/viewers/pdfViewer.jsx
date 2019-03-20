// @flow
import * as React from 'react';
import { stopContextMenu } from 'util/context-menu';
import Button from 'component/button';
import { shell } from 'electron';

type Props = {
  source: string,
};

class PdfViewer extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).openFile = this.openFile.bind(this);
  }

  componentDidMount() {
    this.openFile();
  }

  openFile() {
    const { source } = this.props;
    const path = `file://${source}`;
    shell.openExternal(path);
  }

  render() {
    // We used to be able to just render a webview and display the pdf inside the app
    // This was disabled on electron@3
    // https://github.com/electron/electron/issues/12337
    return (
      <div className="file-render__viewer file-render--pdf" onContextMenu={stopContextMenu}>
        <p>
          {__('PDF opened externally.')}{' '}
          <Button button="link" label={__('Click here')} onClick={this.openFile} />{' '}
          {__('to open it again.')}
        </p>
      </div>
    );
  }
}

export default PdfViewer;
