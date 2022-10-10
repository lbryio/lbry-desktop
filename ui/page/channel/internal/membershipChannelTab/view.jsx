// @flow
import React from 'react';
import { formatDateToMonthAndDay } from 'util/time';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Card from 'component/common/card';
import JoinMembershipCard from 'component/joinMembershipCard';
// import moment from 'moment';
import ClearMembershipDataButton from 'component/clearMembershipData';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  membershipIndex: number,
  // -- redux --
  purchasedChannelMembership: MembershipTier & CreatorMembership,
  doOpenCancelationModalForMembership: (membership: MembershipTier) => void,
  navigate: (string) => void,
};

const MembershipChannelTab = (props: Props) => {
  const {
    uri,
    membershipIndex,
    // -- redux --
    purchasedChannelMembership,
    doOpenCancelationModalForMembership,
  } = props;

  if (!purchasedChannelMembership) {
    return <JoinMembershipCard uri={uri} />;
  } else {
    delete window.pendingMembership;
  }

  const { MembershipDetails, Subscription, Perks } = purchasedChannelMembership;
  // const { channel_name: creatorChannel } = purchasedChannelMembership.Membership;
  const { name: membershipName, description: membershipDescription } = MembershipDetails;

  const {
    // current_period_start: subscriptionStartDate,
    current_period_end: subscriptionEndDate,
    canceled_at: dateCanceled,
  } = Subscription;

  const membershipIsActive = dateCanceled === 0;
  // const startDate = subscriptionStartDate * 1000;
  // const endDate = subscriptionEndDate * 1000;

  // const amountOfMonths = moment(endDate).diff(moment(startDate), 'months', true);
  // const timeAgo = amountOfMonths === 1 ? '1 month' : amountOfMonths + ' months';
  const formattedEndOfMembershipDate = formatDateToMonthAndDay(subscriptionEndDate * 1000);

  return (
    <Card
      className="membership membership-tab"
      body={
        <>
          <div className={'membership__body membership-tier' + membershipIndex}>
            <div className="membership__plan-header">
              <span>{membershipName}</span>

              {membershipIsActive && (
                <Menu>
                  <MenuButton className="menu__button">
                    <Icon size={18} icon={ICONS.SETTINGS} />
                  </MenuButton>
                  <MenuList className={'menu__list membership-tier' + membershipIndex}>
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() => doOpenCancelationModalForMembership(purchasedChannelMembership)}
                    >
                      <div className="menu__link">
                        <Icon size={16} icon={ICONS.DELETE} /> {__('Cancel Membership')}
                      </div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>

            <div className="membership__plan-content">
              <div>
                <label>{__('Creator revenue')}</label>
                <span>${(purchasedChannelMembership.NewPrices[0].creator_receives_amount / 100).toFixed(2)}</span>

                <label>{__('Total Monthly Cost')}</label>
                <span>{`$${(purchasedChannelMembership.NewPrices[0].client_pays / 100).toFixed(2)}`}</span>

                <label>{__('Description')}</label>
                <span>{membershipDescription}</span>
              </div>

              {Perks && (
                <div className="membership-tier__perks">
                  <label>{__('Odysee Perks')}</label>

                  <ul>
                    {Perks.map((tierPerk, i) => (
                      <li key={i} className="membership__perk-item">
                        {__(tierPerk.name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="membership__plan-actions">
                <label>
                  {membershipIsActive
                    ? __('This membership will renew on %renewal_date%', { renewal_date: formattedEndOfMembershipDate })
                    : __('Your cancelled membership will end on %end_date%', {
                        end_date: formattedEndOfMembershipDate,
                      })}
                </label>
              </div>
            </div>
          </div>
          <div className="button--view-memberships">
            <Button
              icon={ICONS.MEMBERSHIP}
              button="primary"
              type="submit"
              label={__('See all my memberships')}
              navigate={`/$/${PAGES.MEMBERSHIPS_SUPPORTER}`}
            />
          </div>

          <ClearMembershipDataButton />
        </>
      }
    />
  );
};

export default MembershipChannelTab;
