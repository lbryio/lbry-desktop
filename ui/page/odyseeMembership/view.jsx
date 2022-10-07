// @flow
import React from 'react';

import { ODYSEE_CHANNEL } from 'constants/channels';

import * as ICONS from 'constants/icons';

import usePersistedState from 'effects/use-persisted-state';

import Page from 'component/page';
import Spinner from 'component/spinner';
import Card from 'component/common/card';
import MembershipSplash from 'component/membershipSplash';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import HelpText from './internal/help-text';
import ClearMembershipDataButton from 'component/clearMembershipData';
import PremiumOption from './internal/premiumOption';

type Props = {
  // -- redux --
  mineFetched: boolean,
  activeMemberships: ?MembershipTiers,
  purchasedMemberships: ?MembershipTiers,
  canceledMemberships: ?MembershipTiers,
  membershipOptions: ?CreatorMemberships,
  doGetCustomerStatus: () => void,
  doMembershipList: (params: MembershipListParams) => Promise<CreatorMemberships>,
};

const OdyseeMembershipPage = (props: Props) => {
  const {
    // -- redux --
    mineFetched,
    activeMemberships,
    purchasedMemberships,
    canceledMemberships,
    membershipOptions,
    doGetCustomerStatus,
    doMembershipList,
  } = props;

  const [hasShownModal, setHasShownModal] = React.useState(false);
  const [showHelp, setShowHelp] = usePersistedState('premium-help-seen', true);

  React.useEffect(() => {
    doGetCustomerStatus();
    doMembershipList({ channel_name: ODYSEE_CHANNEL.NAME, channel_id: ODYSEE_CHANNEL.ID });
  }, [doGetCustomerStatus, doMembershipList]);

  // we are still waiting from the backend if any of these are undefined
  const stillWaitingFromBackend = membershipOptions === undefined || !mineFetched;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const { interval, plan: planValue } = params;

  // add a bit of a delay otherwise it's a bit jarring
  const timeoutValue = 300;

  // if user already selected plan, wait a bit (so it's not jarring) and open modal
  React.useEffect(() => {
    if (!stillWaitingFromBackend && planValue) {
      const delayTimeout = setTimeout(() => {
        // clear query params
        window.history.replaceState(null, null, window.location.pathname);

        setHasShownModal(true);

        // open confirm purchase
        // $FlowFixMe
        document.querySelector('[plan="' + planValue + '"][interval="' + interval + '"]').click();
      }, timeoutValue);

      return () => clearTimeout(delayTimeout);
    }
  }, [stillWaitingFromBackend, planValue, interval]);

  if (stillWaitingFromBackend) {
    return (
      <Page className="premium-wrapper">
        <div className="card-stack">
          <div className="main--empty">
            <Spinner />
          </div>
        </div>
      </Page>
    );
  }

  if (purchasedMemberships?.length === 0 && !planValue && !hasShownModal) {
    return (
      <Page className="premium-wrapper">
        <MembershipSplash pageLocation="confirmPage" />
      </Page>
    );
  }

  return (
    <Page className="premium-wrapper card-stack">
      <Card title={__('Odysee Premium')} subtitle={<ChannelSelector />}>
        <div className="card-stack">
          <Card
            className="premium-explanation-text"
            title={__('Get More Information')}
            titleActions={
              <Button button="close" icon={showHelp ? ICONS.UP : ICONS.DOWN} onClick={() => setShowHelp(!showHelp)} />
            }
            subtitle={__('Expand to learn more about how Odysee Premium works')}
            body={showHelp && <HelpText />}
          />

          {membershipOptions && (!activeMemberships || activeMemberships.length === 0) && (
            <Card title={__('Available Memberships')}>
              {membershipOptions.map((membership) => (
                <PremiumOption key={membership.Membership.name} membershipPurchase={membership} />
              ))}
            </Card>
          )}

          {activeMemberships && (
            <Card title={__('Your Active Memberships')}>
              {activeMemberships.length === 0 ? (
                <h4>{__('You currently have no active memberships')}</h4>
              ) : (
                activeMemberships.map((membership) => (
                  <PremiumOption key={membership.MembershipDetails.name} membershipView={membership} />
                ))
              )}
            </Card>
          )}

          {canceledMemberships && (
            <Card
              className="premium-explanation-text"
              title={__('Canceled Memberships')}
              body={
                canceledMemberships.length === 0 ? (
                  <h4>{__('You currently have no canceled memberships')}</h4>
                ) : (
                  canceledMemberships.map((membership) => (
                    <PremiumOption key={membership.MembershipDetails.name} membershipView={membership} isCancelled />
                  ))
                )
              }
            />
          )}
        </div>
      </Card>

      <ClearMembershipDataButton purchasedMemberships={purchasedMemberships} />
    </Page>
  );
};

export default OdyseeMembershipPage;
