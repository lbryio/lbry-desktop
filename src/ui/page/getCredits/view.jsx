import React from 'react';
import Button from 'component/button';
import RewardSummary from 'component/rewardSummary';
// import ShapeShift from 'component/shapeShift';
import Page from 'component/page';

const GetCreditsPage = () => (
  <Page>
    <RewardSummary />
    {/*
      Removing Shapeshift after they switched to user accounts
      Ideally most of the redux logic should be able to be re-used if we switch to another company
      Or find a way to use ShapShift with an account?
      <ShapeShift />
    */}
    <section className="card card--section">
      <header className="card__header">
        <h2 className="card__title">{__('More Ways To Get LBRY Credits')}</h2>
        <p className="card__subtitle">
          {
            'LBRY credits can be purchased on exchanges, earned for contributions, for mining, and more.'
          }
        </p>
      </header>

      <div className="card__content">
        <div className="card__actions">
          <Button
            button="primary"
            href="https://lbry.com/faq/earn-credits"
            label={__('Read More')}
          />
        </div>
      </div>
    </section>
  </Page>
);

export default GetCreditsPage;
