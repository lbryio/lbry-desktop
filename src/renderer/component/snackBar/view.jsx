// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  removeSnack: any => void,
  snack: ?{
    linkTarget: ?string,
    linkText: ?string,
    message: string,
  },
};

class SnackBar extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.displayTime = 5; // in seconds
    this.hideTimeout = null;
  }

  render() {
    const { snack, removeSnack } = this.props;

    if (!snack) {
      this.hideTimeout = null; // should be unmounting anyway, but be safe?
      return null;
    }

    const { message, linkText, linkTarget } = snack;

    if (this.hideTimeout === null) {
      this.hideTimeout = setTimeout(() => {
        this.hideTimeout = null;
        removeSnack();
      }, this.displayTime * 1000);
    }

    return (
      <div className="snack-bar">
        <div className="snack-bar__message">
          <div>&#9432;</div>
          <div>{message}</div>
        </div>
        {linkText &&
          linkTarget && (
            <Button navigate={linkTarget} className="snack-bar__action" label={linkText} />
          )}
      </div>
    );
  }
}

export default SnackBar;
