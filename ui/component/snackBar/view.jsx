// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import LbcMessage from 'component/common/lbc-message';

type Props = {
  removeSnack: (any) => void,
  snack: ?{
    linkTarget: ?string,
    linkText: ?string,
    message: string,
    isError: boolean,
  },
};

class SnackBar extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.displayTime = 5; // in seconds
    this.hideTimeout = null;
  }

  hideTimeout: ?TimeoutID;
  displayTime: number;

  render() {
    const { snack, removeSnack } = this.props;

    if (!snack) {
      this.hideTimeout = null; // should be unmounting anyway, but be safe?
      return null;
    }

    const { message, linkText, linkTarget, isError } = snack;

    if (this.hideTimeout === null) {
      this.hideTimeout = setTimeout(() => {
        this.hideTimeout = null;
        removeSnack();
      }, this.displayTime * 1000);
    }

    return (
      <div
        className={classnames('snack-bar', {
          'snack-bar--error': isError,
        })}
      >
        <div className="snack-bar__message">
          <Icon icon={isError ? ICONS.ALERT : ICONS.COMPLETED} size={18} />

          <p className="snack-bar__messageText">
            <LbcMessage>{message}</LbcMessage>
          </p>
        </div>
        {linkText && linkTarget && (
          // This is a little weird because of `linkTarget` code in `lbry-redux`
          // Any navigation code should happen in the app, and that should be removed from lbry-redux
          <Button navigate={`/$${linkTarget}`} className="snack-bar__action" label={linkText} />
        )}
      </div>
    );
  }
}

export default SnackBar;
