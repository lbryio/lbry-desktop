// @flow
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  body: string,
  label: string,
};

type State = {
  showTooltip: boolean,
};

class ToolTip extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltip: false,
    };

    (this: any).handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { showTooltip } = this.state;

    if (!showTooltip) {
      document.addEventListener('click', this.handleClick);
    } else {
      document.removeEventListener('click', this.handleClick);
    }

    this.setState({
      showTooltip: !showTooltip,
    });
  }

  render() {
    const { label, body } = this.props;
    const { showTooltip } = this.state;

    return (
      <span className="tooltip">
        <Button button="link" className="help tooltip__link" onClick={this.handleClick}>
          {label}
          {showTooltip && <Icon icon={icons.CLOSE} />}
        </Button>
        <div className={classnames('tooltip__body', { hidden: !showTooltip })}>{body}</div>
      </span>
    );
  }
}

export default ToolTip;
