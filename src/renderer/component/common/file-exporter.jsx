// @flow
import fs from 'fs';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'component/link';
import parseData from 'util/parseData';
import * as icons from 'constants/icons';
import { remote } from 'electron';

type Props = {
  data: Array<any>,
  title: string,
  label: string,
  defaultPath?: string,
  onFileCreated?: (string) => void,
}

class FileExporter extends React.PureComponent<Props> {
  handleButtonClick: () => void

  constructor() {
    super();
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleFileCreation(filename: string, data: any) {
    const { onFileCreated } = this.props;
    fs.writeFile(filename, data, err => {
      if (err) throw err;
      // Do something after creation
      onFileCreated && onFileCreated(filename);
    });
  }

  handleButtonClick() {
    const { title, defaultPath, data } = this.props;

    const options = {
      title,
      defaultPath,
      filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'CSV', extensions: ['csv'] }],
    };

    remote.dialog.showSaveDialog(options, filename => {
      // User hit cancel so do nothing:
      if (!filename) return;
      // Get extension and remove initial dot
      const format = path.extname(filename).replace(/\./g, '');
      // Parse data to string with the chosen format
      const parsed = parseData(data, format);
      // Write file
      parsed && this.handleFileCreation(filename, parsed);
    });
  }

  render() {
    const { title, label } = this.props;
    return (
      <Link
        icon="Download"
        label={label || __('Export')}
        onClick={this.handleButtonClick}
      />
    );
  }
}

export default FileExporter;
