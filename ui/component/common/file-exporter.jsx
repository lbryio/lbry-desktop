// @flow
import * as ICONS from 'constants/icons';

import React from 'react';
import Button from 'component/button';
import Spinner from 'component/spinner';

type Props = {
  data: any,
  label: string,
  tooltip?: string,
  defaultFileName?: string,
  filters?: Array<string>,
  onFetch?: () => void,
  progressMsg?: string,
  disabled?: boolean,
};

class FileExporter extends React.PureComponent<Props> {
  constructor() {
    super();
    (this: any).handleDownload = this.handleDownload.bind(this);
  }

  handleDownload() {
    const { data, defaultFileName } = this.props;

    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = defaultFileName || 'file.txt';
    // $FlowFixMe
    document.body.appendChild(element);
    element.click();
    // $FlowFixMe
    document.body.removeChild(element);
  }

  render() {
    const { data, label, tooltip, disabled, onFetch, progressMsg } = this.props;

    if (onFetch) {
      return (
        <>
          {!progressMsg && (
            <div className="button-group">
              <Button
                button="alt"
                disabled={disabled}
                icon={ICONS.FETCH}
                label={label}
                aria-label={tooltip}
                onClick={() => onFetch()}
              />
              {data && (
                <Button
                  button="alt"
                  disabled={disabled}
                  icon={ICONS.DOWNLOAD}
                  aria-label={__('Download fetched file')}
                  onClick={this.handleDownload}
                />
              )}
            </div>
          )}
          {progressMsg && (
            <>
              {progressMsg}
              <Spinner type="small" />
            </>
          )}
        </>
      );
    } else {
      return (
        <Button
          button="primary"
          disabled={disabled}
          icon={ICONS.DOWNLOAD}
          label={label || __('Export')}
          aria-label={tooltip}
          onClick={this.handleDownload}
        />
      );
    }
  }
}

export default FileExporter;
