// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import Button from 'component/button';

type Props = {
  balance: number,
  totalRewardValue: number,
};

function PublishPage(props: Props) {
  const { balance } = props;

  function scrollToTop() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  }

  return (
    <Page>
      {balance === 0 && (
        <div className="main--empty">
          <Yrbl
            type="sad"
            title={__('Your wallet is empty')}
            subtitle={
              <div>
                <p>{__('You need LBC to create a channel and upload content.')}</p>
                <p>
                  {__(
                    'Never fear though, there are tons of ways to earn LBC! You can earn or purchase LBC, or you can have your friends send you some.'
                  )}
                </p>
                <div className="section__actions">
                  <Button
                    button="primary"
                    icon={ICONS.REWARDS}
                    label={__('Earn Rewards')}
                    navigate={`/$/${PAGES.REWARDS}`}
                  />
                  <Button button="secondary" icon={ICONS.BUY} label={__('Buy Credits')} navigate={`/$/${PAGES.BUY}`} />
                </div>
              </div>
            }
          />
        </div>
      )}
      <PublishForm scrollToTop={scrollToTop} disabled={balance === 0} />
    </Page>
  );
}

export default PublishPage;
