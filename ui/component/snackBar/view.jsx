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
  snackCount: number,
};

type State = {
  isHovering: boolean,
};

class SnackBar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isHovering: false };
    this.intervalId = null;

    (this: any).handleMouseEnter = this.handleMouseEnter.bind(this);
    (this: any).handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  intervalId: ?IntervalID;

  handleMouseEnter() {
    this.setState({ isHovering: true });
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  render() {
    const { snack, snackCount, removeSnack } = this.props;
    const { isHovering } = this.state;

    if (!snack) {
      clearInterval(this.intervalId);
      this.intervalId = null; // should be unmounting anyway, but be safe?
      return null;
    }

    const { message, subMessage, duration, linkText, linkTarget, isError } = snack;

    if (this.intervalId) {
      // TODO: render should be pure
      clearInterval(this.intervalId);
    }

    if (!isHovering) {
      this.intervalId = setInterval(
        () => {
          removeSnack();
        },
        duration === 'long' ? 10000 : 5000
      );
    }

    return (
      <div
        className={classnames('snack-bar', {
          'snack-bar--error': isError,
          'snack-bar--stacked-error': snackCount > 1 && isError,
          'snack-bar--stacked-non-error': snackCount > 1 && !isError,
        })}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
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
