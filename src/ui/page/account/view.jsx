import React from 'react';
import classnames from 'classnames';
import RewardSummary from 'component/rewardSummary';
import RewardTotal from 'component/rewardTotal';
import Page from 'component/page';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';
import UserEmail from 'component/userEmail';
import InvitePage from 'page/invite';

const WalletPage = () => (
  <Page>
    {IS_WEB && <UnsupportedOnWeb />}
    <div className={classnames({ 'card--disabled': IS_WEB })}>
      <div className="columns">
        <UserEmail />
        <div>
          <RewardSummary />
          <RewardTotal />
        </div>
      </div>
      <InvitePage />
    </div>
  </Page>
);

export default WalletPage;
