// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Button from 'component/button';

// Note:
// When we use this in other parts of the app, we will probably need to
// add props for collapsed height

type Props = {
  children: React$Node | Array<React$Node>,
};

type State = {
  expanded: boolean,
};

export default class Expandable extends PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      expanded: false,
    };

    (this: any).handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { children } = this.props;
    const { expanded } = this.state;

    return (
      <div className="expandable">
        <div
          className={classnames({
            'expandable--open': expanded,
            'expandable--closed': !expanded,
          })}
        >
          {children}
        </div>
        <Button
          button="link"
          className="expandable__button"
          label={expanded ? __('Less') : __('More')}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
