import React from 'react';
import Button from 'component/button';
import RewardSummary from 'component/rewardSummary';
import ShapeShift from 'component/shapeShift';
import Page from 'component/page';
import * as icons from 'constants/icons';

const GetCreditsPage = props => (
  <Page>
    <RewardSummary />
    <ShapeShift />
    <section className="card card--section">
      <div className="card__title">{__('From External Wallet')}</div>
      <div className="card__actions">
        <Button button="primary" icon={icons.SEND} navigate="/send" label={__('Send / Receive')} />
      </div>
    </section>
    <section className="card card--section">
      <div className="card__title">{__('More ways to get LBRY Credits')}</div>
      <div className="card__content">
        <p>
          {
            'LBRY credits can be purchased on exchanges, earned for contributions, for mining, and more.'
          }
        </p>
      </div>
      <div className="card__actions">
        <Button button="primary" href="https://lbry.io/faq/earn-credits" label={__('Read More')} />
      </div>
    </section>
  </Page>
);

export default GetCreditsPage;
