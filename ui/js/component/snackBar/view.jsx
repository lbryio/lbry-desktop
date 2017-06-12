import React from "react";
import Link from "component/link";

class SnackBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this._displayTime = 5; // in seconds
    this._hideTimeout = null;
  }

  render() {
    const { navigate, snacks, removeSnack } = this.props;

    if (!snacks.length) {
      this._hideTimeout = null; //should be unmounting anyway, but be safe?
      return null;
    }

    const snack = snacks[0];
    const { message, linkText, linkTarget } = snack;

    if (this._hideTimeout === null) {
      this._hideTimeout = setTimeout(() => {
        this._hideTimeout = null;
        removeSnack();
      }, this._displayTime * 1000);
    }

    return (
      <div className="snack-bar">
        {message}
        {linkText &&
          linkTarget &&
          <Link
            onClick={() => navigate(linkTarget)}
            className="snack-bar__action"
            label={linkText}
          />}
      </div>
    );
  }
}

export default SnackBar;
