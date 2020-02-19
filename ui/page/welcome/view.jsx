// @flow
import React from 'react';
import PrivacyAgreement from 'component/privacyAgreement';
import Page from 'component/page';

export default function Welcome() {
  return (
    <Page noHeader className="main--auth-page">
      <PrivacyAgreement />
    </Page>
  );
}
