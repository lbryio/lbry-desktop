// @flow
import React from 'react';
import Page from 'component/page';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
const { buildURI } = require('lbry-redux');

const DELAY_TIME = 1500;

// Landing page for opening lbry urls on external applications.
type Props = {
  match: {
    params: {
      claimId: ?string,
      claimName: ?string,
    },
  },
};
const OpenInDesktop = (props: Props) => {
  const { match } = props;
  const { params } = match;
  const [title, setTitle] = React.useState('Loading...');
  const [claimUrl, setClaimUrl] = React.useState(null);

  // Get claim url
  React.useEffect(() => {
    if (params) {
      try {
        const url = buildURI(params);
        if (url && claimUrl !== url) {
          setClaimUrl(url);
        }
      } catch {}
    }
  }, [params, claimUrl, setClaimUrl]);

  // Open url on external application
  React.useEffect(() => {
    if (claimUrl) {
      setTimeout(() => {
        setTitle('Ready!');
        window.open(claimUrl, '_top');
      }, DELAY_TIME);
    }
  }, [claimUrl]);

  return (
    <Page>
      <div className="main main--empty">
        <Yrbl
          type="happy"
          title={__(title)}
          subtitle={
            <p>
              {__('You will need an external application.')}
              <br />
              {__('Get lbry desktop ')}
              <Button button="link" label={__('here!')} href="https://lbry.com/get" />
            </p>
          }
        />
      </div>
    </Page>
  );
};

export default OpenInDesktop;
