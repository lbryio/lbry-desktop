// @flow
import * as ICONS from 'constants/icons';

import React from 'react';
import Button from 'component/button';
import Spinner from 'component/spinner';
import parseData from 'util/parse-data';

type Props = {
  data: Array<any>,
  label: string,
  tooltip?: string,
  defaultFileName?: string,
  filters?: Array<string>,
  parseFormat: string,
  onFetch?: () => void,
  isFetching?: boolean,
  onSuccess?: () => void,
  onError?: (string) => void,
  disabled?: boolean,
};

class FileExporter extends React.PureComponent<Props> {
  constructor() {
    super();
    (this: any).handleDownload = this.handleDownload.bind(this);
  }

  handleDownload() {
    const { data, defaultFileName, filters, parseFormat, onSuccess, onError } = this.props;

    if ((!data || data.length === 0) && onError) {
      onError('No data to export');
      return;
    }

    const parsed = parseData(data, parseFormat, filters);
    if (!parsed && onError) {
      onError('Failed to process fetched data.');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([parsed], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = defaultFileName || 'file.txt';
    // $FlowFixMe
    document.body.appendChild(element);
    element.click();
    // $FlowFixMe
    document.body.removeChild(element);

    if (onSuccess) {
      onSuccess();
    }
  }

  render() {
    const { data, label, tooltip, disabled, onFetch, isFetching } = this.props;

    if (onFetch) {
      const isDataFetched = data && data.length !== 0;

      return (
        <>
          {!isFetching && (
            <div className="button-group">
              <Button
                button="alt"
                disabled={disabled}
                icon={ICONS.FETCH}
                label={label}
                aria-label={tooltip}
                onClick={() => onFetch()}
              />
              {isDataFetched && (
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
          {isFetching && (
            <>
              {__('Fetching data')}
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
