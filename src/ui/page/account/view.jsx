// @flow
import React from 'react';
import RewardSummary from 'component/rewardSummary';
import RewardTotal from 'component/rewardTotal';
import Page from 'component/page';
import UserEmail from 'component/userEmail';
import InviteNew from 'component/inviteNew';
import InviteList from 'component/inviteList';

const AccountPage = (props: any) => {
  return (
    <Page>
      <div className="columns section">
        <div>
          <RewardTotal />
          <UserEmail />
        </div>
        <div>
          <RewardSummary />
          <InviteNew />
        </div>
      </div>
      <InviteList />
    </Page>
  );
};
export default AccountPage;
