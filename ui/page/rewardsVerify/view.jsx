// @flow
import React from 'react';
import UserVerify from 'component/userVerify';
import Page from 'component/page';
import { useHistory } from 'react-router-dom';

type Props = {
  user: ?User,
};

function RewardsVerifyPage(props: Props) {
  const { user } = props;
  const { goBack } = useHistory();
  const rewardsApproved = user && user.is_reward_approved;

  React.useEffect(() => {
    if (rewardsApproved) {
      goBack();
    }
  }, [rewardsApproved]);

  return (
    <Page>
      <UserVerify onSkip={() => goBack()} />
    </Page>
  );
}

export default RewardsVerifyPage;
