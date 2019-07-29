// @flow
import * as React from 'react';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  unclaimedRewardAmount: number,
  fetching: boolean,
};

class RewardSummary extends React.Component<Props> {
  render() {
    const { unclaimedRewardAmount, fetching } = this.props;
    const hasRewards = unclaimedRewardAmount > 0;
    return (
      <section className="card card--section">
        <h2 className="card__title">{__('Rewards')}</h2>

        <p className="card__subtitle">
          {fetching && __('You have...')}
          {!fetching && hasRewards ? (
            <React.Fragment>
              {/* @i18nfixme */}
              {__('You have')}
              &nbsp;
              <CreditAmount inheritStyle amount={unclaimedRewardAmount} precision={8} />
              &nbsp;
              {__('in unclaimed rewards')}.
            </React.Fragment>
          ) : (
            __('You have no rewards available, please check')
          )}
        </p>

        <div className="card__actions">
          <Button
            button="primary"
            navigate="/$/rewards"
            label={hasRewards ? __('Claim Rewards') : __('View Rewards')}
          />
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/rewards" />.
        </div>
      </section>
    );
  }
}

export default RewardSummary;
