// @flow
import React from 'react';
import Link from 'component/link';
import { CreditAmount } from 'component/common';

type Props = {
  unclaimedRewardAmount: number,
};

const RewardSummary = (props: Props) => {
  const { unclaimedRewardAmount } = props;

  return (
    <section className="card">
      <div className="card__title-primary">
        <h3>{__('Rewards')}</h3>
        <p className="help">
          {__('Read our')} <Link href="https://lbry.io/faq/rewards">{__('FAQ')}</Link>{' '}
          {__('to learn more about LBRY Rewards')}.
        </p>
      </div>
      <div className="card__content">
        {unclaimedRewardAmount > 0 ? (
          <p>
            {__('You have')} <CreditAmount amount={unclaimedRewardAmount} precision={8} />{' '}
            {__('in unclaimed rewards')}.
          </p>
        ) : (
          <p>{__('There are no rewards available at this time, please check back later')}.</p>
        )}
      </div>
      <div className="card__actions">
        <Link button="primary" navigate="/rewards" label={__('Claim Rewards')} />
      </div>
    </section>
  );
};

export default RewardSummary;
