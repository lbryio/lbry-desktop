import React from "react";

const { remote } = require("electron");
class FileSelector extends React.PureComponent {
  static propTypes = {
    type: React.PropTypes.oneOf(["file", "directory"]),
    initPath: React.PropTypes.string,
    onFileChosen: React.PropTypes.func,
  };

  static defaultProps = {
    type: "file",
  };

  componentWillMount() {
    this.setState({
      path: this.props.initPath || null,
    });
  }

  handleButtonClick() {
    remote.dialog.showOpenDialog(
      {
        properties: this.props.type == "file"
          ? ["openFile"]
          : ["openDirectory", "createDirectory"],
      },
      paths => {
        if (!paths) {
          // User hit cancel, so do nothing
          return;
        }

        const path = paths[0];
        this.setState({
          path: path,
        });
        if (this.props.onFileChosen) {
          this.props.onFileChosen(path);
        }
      }
    );
  }

  render() {
    return (
      <div className="file-selector">
        <button
          type="button"
          className="file-selector__choose-button"
          onClick={() => this.handleButtonClick()}
        >
          {this.props.type == "file"
            ? __("Choose File")
            : __("Choose Directory")}
        </button>
        {" "}
        <span className="file-selector__path">
          {this.state.path ? this.state.path : __("No File Chosen")}
        </span>
      </div>
    );
  }
}

export default FileSelector;
