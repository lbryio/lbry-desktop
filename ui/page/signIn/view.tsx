import React from 'react';
import UserSignIn from 'component/userSignIn';
import Page from 'component/page';

export default function SignInPage() {
  return (
    // @ts-expect-error - TS2322 (ts-migration)
    <Page authPage noFooter>
      <UserSignIn />
    </Page>
  );
}
