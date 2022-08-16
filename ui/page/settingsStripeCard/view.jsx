// @flow
import React from 'react';

import Page from 'component/page';
import StripeCard from 'component/settingsStripeCard';

type Props = {
  cardDetails: StripeCardDetails,
};

const SettingsStripeCard = (props: Props) => {
  const { cardDetails } = props;

  return (
    <Page
      settingsPage
      noFooter
      noSideNavigation
      className="card-stack"
      backout={{ title: __(cardDetails === null ? 'Add Card' : 'Your Card'), backLabel: __('Back') }}
    >
      <StripeCard />
    </Page>
  );
};

export default SettingsStripeCard;
