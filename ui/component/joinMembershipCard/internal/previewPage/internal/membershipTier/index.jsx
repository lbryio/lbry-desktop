// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import MembershipDetails from '../membershipDetails';

type Props = {
  membership: CreatorMembership,
  disabled?: boolean,
  index?: number,
  length?: number,
  disabled?: boolean,
  isChannelTab?: boolean,
  handleSelect: () => void,
};

const MembershipTier = (props: Props) => {
  const { membership, index, length, disabled, isChannelTab, handleSelect } = props;

  return (
    <div
      className={
        Number.isInteger(index) && Number.isInteger(length)
          ? `membership-tier__wrapper item${(index || 0) + 1}-${length || 0}`
          : 'membership-tier__wrapper'
      }
    >
      <MembershipDetails
        isChannelTab={isChannelTab}
        membership={membership}
        headerAction={
          <Button
            icon={ICONS.MEMBERSHIP}
            button="primary"
            label={__('Join for $%membership_price% per month', {
              membership_price: membership?.NewPrices[0]?.creator_receives_amount / 100,
            })}
            onClick={handleSelect}
            disabled={disabled}
          />
        }
      />
    </div>
  );
};

export default MembershipTier;
