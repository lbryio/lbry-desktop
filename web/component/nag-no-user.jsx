// @flow
import React from 'react';
import Nag from 'component/common/nag';

export default function NagNoUser() {
  return (
    <Nag
      type="error"
      message={__('Could not get a user ID. Account functions will be unavailable. Try again in a bit.')}
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
    />
  );
}
