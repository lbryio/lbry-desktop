// @flow
import { SITE_NAME } from 'config';
import React from 'react';
import Nag from 'component/common/nag';
import I18nMessage from 'component/i18nMessage';

export default function NagNoUser() {

  return (
    <Nag
      type="error"
      message={
        <I18nMessage
          tokens={{
            SITE_NAME,
          }}
        >
          %DOMAIN% id not available. Account functions will be unavailable. Refresh to try again.
        </I18nMessage>
      }
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
    />
  );
}
