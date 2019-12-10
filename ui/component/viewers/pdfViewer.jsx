// @flow
import * as React from 'react';
import { stopContextMenu } from 'util/context-menu';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
// @if TARGET='app'
import { shell } from 'electron';
// @endif

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
    // @if TARGET='app'
    shell.openExternal(path);
    // @endif
  }

  render() {
    // We used to be able to just render a webview and display the pdf inside the app
    // This was disabled on electron@3
    // https://github.com/electron/electron/issues/12337
    const { source } = this.props;
    return (
      <div className="file-render__viewer--pdf" onContextMenu={stopContextMenu}>
        {/* @if TARGET='app' */}
        <p>
          <I18nMessage
            tokens={{ click_here: <Button button="link" label={__('Click here')} onClick={this.openFile} /> }}
          >
            PDF opened externally. %click_here% to open it again.
          </I18nMessage>
        </p>
        {/* @endif */}

        {/* @if TARGET='web' */}
        <div className="file-render__viewer">
          <iframe title={__('File preview')} src={source} />
        </div>
        {/* @endif */}
      </div>
    );
  }
}

export default PdfViewer;
