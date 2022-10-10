// @flow
import React from 'react';
import Button from 'component/button';
import moment from 'moment';

import { formatLbryUrlForWeb } from 'util/url';
import { toCapitalCase } from 'util/string';
import { buildURI } from 'util/lbryURI';

import ChannelThumbnail from 'component/channelThumbnail';
import * as ICONS from 'constants/icons';
import Yrbl from 'component/yrbl';
import Spinner from 'component/spinner';
import UriIndicator from 'component/uriIndicator';

type Props = {
  // -- redux --
  myPurchasedCreatorMemberships: Array<MembershipTiers>,
  doMembershipMine: () => Promise<MembershipTiers>,
};

function PledgesTab(props: Props) {
  const { myPurchasedCreatorMemberships, doMembershipMine } = props;

  React.useEffect(() => {
    if (myPurchasedCreatorMemberships === undefined) {
      doMembershipMine();
    }
  }, [doMembershipMine, myPurchasedCreatorMemberships]);

  if (myPurchasedCreatorMemberships === undefined) {
    return (
      <div className="main--empty">
        <Spinner />
      </div>
    );
  }

  if (!myPurchasedCreatorMemberships || myPurchasedCreatorMemberships.length === 0) {
    return (
      <div className="membership__mypledges-wrapper">
        <div className="membership__mypledges-content">
          <Yrbl
            type="happy"
            subtitle={__('Find creators that you like and support them. Your pledges will show up on this page.')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="membership__mypledges-wrapper">
      <div className="membership__mypledges-content">
        <div className="membership-table__wrapper">
          <table className="table table--pledges">
            <thead>
              <tr>
                <th className="channelName-header" colSpan="2">
                  {__('Channel Name')}
                </th>
                <th>{__('Tier')}</th>
                <th>{__('Total Supporting Time')}</th>
                <th>{__('Amount')}</th>
                <th>{__('Status')}</th>
                <th className="membership-table__page">{__('Page')}</th>
              </tr>
            </thead>
            <tbody>
              {myPurchasedCreatorMemberships.map((memberships) =>
                memberships.map((membership) => {
                  const memberChannelName = membership.Membership.channel_name;
                  const memberChannelUri =
                    memberChannelName === ''
                      ? ''
                      : buildURI({ channelName: memberChannelName, channelClaimId: membership.Membership.channel_id });

                  const creatorChannelId = membership.MembershipDetails.channel_id;
                  const creatorChannelUri = buildURI({
                    channelName: membership.MembershipDetails.channel_name,
                    channelClaimId: creatorChannelId,
                  });
                  const creatorChannelPath = formatLbryUrlForWeb(creatorChannelUri);

                  const currency = membership.Subscription.plan.currency.toUpperCase();
                  const supportAmount = membership.Subscription.plan.amount; // in cents or 1/100th EUR
                  const interval = membership.Subscription.plan.interval;

                  const startDate = membership.Subscription.current_period_start * 1000;
                  const endDate = membership.Subscription.current_period_end * 1000;
                  const amountOfMonths = Math.ceil(moment(endDate).diff(moment(startDate), 'months', true));
                  const timeAgoInMonths =
                    amountOfMonths === 1 ? __('1 Month') : __('%time_ago% Months', { time_ago: amountOfMonths });

                  return (
                    <tr key={membership.Membership.id}>
                      <td className="channelThumbnail">
                        <ChannelThumbnail xsmall uri={creatorChannelUri} />
                        <ChannelThumbnail
                          xxsmall
                          uri={memberChannelUri === '' ? undefined : memberChannelUri}
                          tooltipTitle={memberChannelName === '' ? __('Anonymous') : memberChannelName}
                        />
                      </td>

                      <td>
                        <UriIndicator uri={creatorChannelUri} link />
                      </td>

                      <td>{membership.MembershipDetails.name}</td>

                      <td>{timeAgoInMonths}</td>

                      <td>
                        ${supportAmount / 100} {currency} / {__(toCapitalCase(interval))}
                      </td>

                      <td>{membership.Subscription.status === 'active' ? __('Active') : __('Cancelled')}</td>

                      <td>
                        <span dir="auto" className="button__label">
                          <Button
                            button="primary"
                            icon={ICONS.MEMBERSHIP}
                            navigate={creatorChannelPath + '?view=membership'}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default PledgesTab;
