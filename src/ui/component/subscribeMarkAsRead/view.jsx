// @flow
import * as ICONS from 'constants/icons';
import React, { PureComponent } from 'react';
import Button from 'component/button';

type Props = {
  channel: ?string,
  doRemoveUnreadSubscriptions: (?string) => void,
};

export default class MarkAsRead extends PureComponent<Props> {
  constructor() {
    super();
    (this: any).handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { channel, doRemoveUnreadSubscriptions } = this.props;

    // If there is no channel, mark all as read
    // If there is a channel, only mark that channel as read
    if (channel) {
      doRemoveUnreadSubscriptions(channel);
    } else {
      doRemoveUnreadSubscriptions();
    }
  }

  render() {
    const { channel } = this.props;
    const label = channel ? __('Mark as read') : __('Mark all as read');
    return <Button button="inverse" icon={ICONS.COMPLETE} label={label} onClick={this.handleClick} />;
  }
}
