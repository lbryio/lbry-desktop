// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  balance: number,
  totalRewardValue: number,
};

function RewardAuthIntro(props: Props) {
  const { totalRewardValue } = props;
  const totalRewardRounded = Math.floor(totalRewardValue / 10) * 10;

  return (
    <Card
      title={__('Sign In to lbry.tv to Earn Rewards')}
      subtitle={
        <I18nMessage
          tokens={{
            credit_amount: <CreditAmount inheritStyle amount={totalRewardRounded} />,
          }}
        >
          A lbry.tv account allows you to earn more than %credit_amount% in rewards, backup your data, and get content
          and security updates.
        </I18nMessage>
      }
      actions={
        <Button
          button="primary"
          navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`}
          label={__('Unlock Rewards')}
        />
      }
    />
  );
}

export default RewardAuthIntro;
