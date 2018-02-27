import React from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';

const PublishPage = props => (
    <Page>
      <PublishForm {...props} />
    </Page>
);

export default PublishPage;
