import fs from 'fs';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'component/link';
import parseData from 'util/parseData';
import * as icons from 'constants/icons';
const { remote } = require('electron');

class FileExporter extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.string,
    filters: PropTypes.arrayof(PropTypes.string),
    defaultPath: PropTypes.string,
    onFileCreated: PropTypes.func,
  };

  static defaultProps = {
    filters: [],
  };

  constructor(props) {
    super(props);
  }

  handleFileCreation(filename, data) {
    const { onFileCreated } = this.props;
    fs.writeFile(filename, data, err => {
      if (err) throw err;
      // Do something after creation
      onFileCreated && onFileCreated(filename);
    });
  }

  handleButtonClick() {
    const { title, data, defaultPath, filters = [] } = this.props;

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

    remote.dialog.showSaveDialog(options, filename => {
      // User hit cancel so do nothing:
      if (!filename) return;
      // Get extension and remove initial dot
      const format = path.extname(filename).replace(/\./g, '');
      // Parse data to string with the chosen format
      const parsed = parseData(data, format, filters);
      // Write file
      parsed && this.handleFileCreation(filename, parsed);
    });
  }

  render() {
    const { title, label } = this.props;
    return (
      <Link
        button="primary"
        icon={icons.DOWNLOAD}
        title={title || __('Export')}
        label={label || __('Export')}
        onClick={() => this.handleButtonClick()}
      />
    );
  }
}

export default FileExporter;
