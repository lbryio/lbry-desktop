// @flow
import React from 'react';
import UserPasswordSet from 'component/userPasswordSet';
import Page from 'component/page';

export default function PasswordSetPage() {
  return (
    <Page authPage>
      <UserPasswordSet />
    </Page>
  );
}
