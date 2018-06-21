// @flow
import fs from 'fs';
import path from 'path';
import React from 'react';
import Button from 'component/button';
import parseData from 'util/parseData';
import * as icons from 'constants/icons';
import { remote } from 'electron';

type Props = {
  data: Array<any>,
  title: string,
  label: string,
  defaultPath?: string,
  filters: Array<string>,
  onFileCreated?: string => void,
};

class FileExporter extends React.PureComponent<Props> {
  static defaultProps = {
    filters: [],
  };

  constructor() {
    super();
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick: () => void;

  handleFileCreation(filename: string, data: any) {
    const { onFileCreated } = this.props;
    fs.writeFile(filename, data, err => {
      if (err) throw err;
      // Do something after creation
      onFileCreated && onFileCreated(filename);
    });
  }

  handleButtonClick() {
    const { title, data, defaultPath, filters } = this.props;

    const options = {
      title,
      defaultPath,
      filters: [
        {
          name: 'CSV',
          extensions: ['csv'],
        },
        {
          name: 'JSON',
          extensions: ['json'],
        },
      ],
    };

    remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      options,
      filename => {
        // User hit cancel so do nothing:
        if (!filename) return;
        // Get extension and remove initial dot
        const format = path.extname(filename).replace(/\./g, '');
        // Parse data to string with the chosen format
        const parsed = parseData(data, format, filters);
        // Write file
        parsed && this.handleFileCreation(filename, parsed);
      }
    );
  }

  render() {
    const { title, label } = this.props;
    return (
      <Button
        button="primary"
        icon={icons.DOWNLOAD}
        label={label || __('Export')}
        onClick={this.handleButtonClick}
      />
    );
  }
}

export default FileExporter;
