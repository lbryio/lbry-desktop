// @flow
import React from 'react';

import * as PAGES from 'constants/pages';

import Button from 'component/button';
import withCreditCard from 'hocs/withCreditCard';

type Props = {
  pageLocation: string,
  interval: string,
  plan: string,
};

const JoinButton = (props: Props) => {
  const { pageLocation, interval, plan } = props;

  return (
    <Button
      button="primary"
      label={__('Join')}
      navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}?interval=${interval}&plan=${plan}&pageLocation=${pageLocation}&`}
    />
  );
};

export default withCreditCard(JoinButton);
