// @flow
import React from 'react';
import Page from 'component/page';
import Invited from 'component/invited';

export default function ReferredPage() {
  return (
    <Page authPage className="main--auth-page">
      <Invited />
    </Page>
  );
}
