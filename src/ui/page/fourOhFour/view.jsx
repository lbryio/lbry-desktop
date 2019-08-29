import React from 'react';
import Page from 'component/page';
import Yrbl from 'component/yrbl';

const FourOhFourPage = () => (
  <Page notcontained>
    <div className="main main--empty">
      <Yrbl type="sad" title={__('404')} subtitle={<p>{__('Page Not Found')}</p>} />
      <p>{__('Four-Oh-Four-Oh-Four-Oh-Four! Four-Oh-Four!')}</p>
      <p>{__('Four-Oh-Four, Oh, Four...')}</p>
      <p>{__('Four-Oh-Four-Oh-Four-Oh-Four, Oh-Four, Oh-Four...')}</p>
    </div>
  </Page>
);

export default FourOhFourPage;
