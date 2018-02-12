// @flow
import * as React from 'react';
import Button from 'component/link';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  unclaimedRewardAmount: number,
};

const RewardSummary = (props: Props) => {
  const { unclaimedRewardAmount } = props;
  const hasRewards = unclaimedRewardAmount > 0;

  return (
    <section className="card card--section">
      <div className="card__title">{__('Rewards')}</div>
      <p className="card__subtitle">
        {hasRewards ? (
          <React.Fragment>
            {__('You have')} <CreditAmount amount={unclaimedRewardAmount} precision={8} />{' '}
            {__('in unclaimed rewards')}.
          </React.Fragment>
        ) : (
          <React.Fragment>
            {__('There are no rewards available at this time, please check back later')}.
          </React.Fragment>
        )}
      </p>
      <div className="card__actions">
        <Button navigate="/rewards" label={hasRewards ? __('Claim Rewards') : __('View Rewards')} />
      </div>
    </section>
  );
};

export default RewardSummary;
