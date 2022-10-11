// @flow
import React from 'react';
import UserVerify from 'component/userVerify';
import Page from 'component/page';
import { useHistory } from 'react-router-dom';

function RewardsVerifyPage() {
  const { goBack } = useHistory();

  return (
    <Page>
      <UserVerify onSkip={() => goBack()} />
    </Page>
  );
}

export default RewardsVerifyPage;
