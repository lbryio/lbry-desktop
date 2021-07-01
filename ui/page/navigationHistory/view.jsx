// @flow
import React from 'react';
import Page from 'component/page';
import NavigationHistory from 'component/navigationHistory';

export default function NavigationHistoryPage(props: any) {
  // Pass `props` into the component for reach router props
  return (
    <Page>
      <NavigationHistory {...props} />
    </Page>
  );
}
