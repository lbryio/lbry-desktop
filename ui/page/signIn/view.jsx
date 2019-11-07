// @flow
import React from 'react';
import UserSignIn from 'component/userSignIn';
import Page from 'component/page';

export default function SignInPage() {
  return (
    <Page authPage className="main--auth-page">
      <UserSignIn />
    </Page>
  );
}
