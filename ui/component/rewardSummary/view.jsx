// @flow
import * as React from 'react';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';

type Props = {
  unclaimedRewardAmount: number,
  fetching: boolean,
};

class RewardSummary extends React.Component<Props> {
  render() {
    const { unclaimedRewardAmount, fetching } = this.props;
    const hasRewards = unclaimedRewardAmount > 0;
    return (
      <Card
        title={__('Available Rewards')}
        subtitle={
          <React.Fragment>
            {fetching && __('You have...')}
            {!fetching && hasRewards ? (
              <I18nMessage
                tokens={{
                  credit_amount: <CreditAmount inheritStyle amount={unclaimedRewardAmount} precision={8} />,
                }}
              >
                You have %credit_amount% in unclaimed rewards.
              </I18nMessage>
            ) : (
              __('You have no rewards available.')
            )}
          </React.Fragment>
        }
        actions={
          <div className="section__actions">
            <Button
              button="primary"
              navigate="/$/rewards"
              label={hasRewards ? __('Claim Rewards') : __('View Rewards')}
            />
            <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/rewards" />.
          </div>
        }
      />
    );
  }
}

export default RewardSummary;
