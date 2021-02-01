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
      // $FlowFixMe
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
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
