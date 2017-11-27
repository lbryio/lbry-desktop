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

  constructor(props) {
    super(props);
    this._inputElem = null;
  }

  componentWillMount() {
    this.setState({
      path: this.props.initPath || null,
    });
  }

  handleButtonClick() {
    remote.dialog.showOpenDialog(
      {
        properties:
          this.props.type == "file"
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
          className="button-block button-alt file-selector__choose-button"
          onClick={() => this.handleButtonClick()}
        >
          <span className="button__content">
            <span className="button-label">
              {this.props.type == "file"
                ? __("Choose File")
                : __("Choose Directory")}
            </span>
          </span>
        </button>{" "}
        <span className="file-selector__path">
          <input
            className="input-copyable"
            type="text"
            ref={input => {
              this._inputElem = input;
            }}
            onFocus={() => {
              this._inputElem.select();
            }}
            readOnly="readonly"
            value={this.state.path || __("No File Chosen")}
          />
        </span>
      </div>
    );
  }
}

export default FileSelector;
