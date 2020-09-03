// @flow
import { SITE_NAME } from 'config';
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  balance: number,
  totalRewardValue: number,
  title?: string,
};

function RewardAuthIntro(props: Props) {
  const { totalRewardValue, title } = props;
  const totalRewardRounded = Math.floor(totalRewardValue / 10) * 10;

  return (
    <Card
      title={title || __('Log in to %SITE_NAME% to earn rewards', { SITE_NAME })}
      subtitle={
        <I18nMessage
          tokens={{
            credit_amount: <CreditAmount inheritStyle amount={totalRewardRounded} />,
            site_name: SITE_NAME,
          }}
        >
          A %site_name% account allows you to earn more than %credit_amount% in rewards, backup your data, and get
          content and security updates.
        </I18nMessage>
      }
      actions={
        <Button
          requiresAuth
          button="primary"
          navigate={`/$/${PAGES.REWARDS_VERIFY}?redirect=/$/${PAGES.REWARDS}`}
          label={__('Unlock Rewards')}
        />
      }
    />
  );
}

export default RewardAuthIntro;
