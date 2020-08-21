// @flow
import React from 'react';
import UserPasswordReset from 'component/userPasswordReset';
import Page from 'component/page';

export default function PasswordResetPage() {
  return (
    <Page authPage>
      <UserPasswordReset />
    </Page>
  );
}
