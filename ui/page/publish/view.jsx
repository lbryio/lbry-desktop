// @flow
import React from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  balance: number,
};

function PublishPage(props: Props) {
  const { balance } = props;

  function scrollToTop() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  }

  return (
    <Page
      noFooter
      noSideNavigation
      backout={{
        title: __('Upload'),
        backLabel: __('Back'),
      }}
    >
      {balance === 0 && <YrblWalletEmpty />}
      <PublishForm scrollToTop={scrollToTop} disabled={balance === 0} />
    </Page>
  );
}

export default PublishPage;
