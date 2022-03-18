// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import LbcMessage from 'component/common/lbc-message';

type Props = {
  removeSnack: (any) => void,
  snack: ?ToastParams,
};

class SnackBar extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.hideTimeout = null;
  }

  hideTimeout: ?TimeoutID;

  render() {
    const { snack, removeSnack } = this.props;

    if (!snack) {
      this.hideTimeout = null; // should be unmounting anyway, but be safe?
      return null;
    }

    const { message, subMessage, duration, linkText, linkTarget, isError } = snack;

    if (this.hideTimeout === null) {
      this.hideTimeout = setTimeout(
        () => {
          this.hideTimeout = null;
          removeSnack();
        },
        duration === 'long' ? 15000 : 5000
      );
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
            {subMessage && (
              <p className="snack-bar__messageText snack-bar__messageText--sub">
                <LbcMessage>{subMessage}</LbcMessage>
              </p>
            )}
          </p>
          <Button
            className="snack-bar__close"
            icon={ICONS.REMOVE}
            title={__('Dismiss')}
            onClick={() => removeSnack()}
          />
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
