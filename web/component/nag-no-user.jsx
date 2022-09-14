// @flow
import React from 'react';
import Nag from 'component/nag';

export default function NagNoUser() {
  return (
    <Nag
      type="error"
      message={__(`Sorry, account functions unavailable currently, we're down for maintence. Please check back later.`)}
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
    />
  );
}
