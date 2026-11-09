import React from 'react';
import UserPasswordReset from 'component/userPasswordReset';
import Page from 'component/page';

export default function PasswordResetPage() {
  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page authPage>
      {/* @ts-expect-error - TS2322, TS2739 (ts-migration) */}
      <UserPasswordReset />
    </Page>
  );
}
