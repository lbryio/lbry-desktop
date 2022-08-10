// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';

const CareersPage = () => {
  return (
    <Page>
      <Card
        className="careers-overview-page"
        body={
          <>
            <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Work With Us</h1>

            <section className="section card--section">
              <h1 className="card__title">Join our team and help shape the future of online video</h1>

              <Button
                label={__('IT Project Manager')}
                href={`/$/${PAGES.CAREERS_IT_PROJECT_MANAGER}`}
                className="job-listings"
              />
            </section>
          </>
        }
      />
    </Page>
  );
};

export default CareersPage;
