// @flow
import React from 'react';
import classnames from 'classnames';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import ChannelThumbnail from 'component/channelThumbnail';
import ChannelTitle from 'component/channelTitle';
import MembershipBadge from 'component/membershipBadge';

type Props = {
  isSelected?: boolean,
  // -- redux --
  uri: string,
  odyseeMembership: ?string,
};

const ChannelListItem = (props: Props) => {
  const { uri, odyseeMembership, isSelected = false } = props;

  return (
    <div className={classnames('channel__list-item', { 'channel__list-item--selected': isSelected })}>
      <ChannelThumbnail uri={uri} hideStakedIndicator xsmall noLazyLoad />
      <ChannelTitle uri={uri} />
      {odyseeMembership && <MembershipBadge membershipName={odyseeMembership} />}
      {isSelected && <Icon icon={ICONS.DOWN} />}
    </div>
  );
};

export default ChannelListItem;
