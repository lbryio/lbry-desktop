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
    type: PropTypes.oneOf(['json', 'csv']),
    title: PropTypes.string,
    defaultPath: PropTypes.string,
    onFileCreated: PropTypes.func,
  };

  static defaultProps = {
    type: 'json',
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      path: this.props.initPath || null,
    });
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
