// @flow
import { SITE_NAME } from 'config';
import React from 'react';
import Nag from 'component/common/nag';
import I18nMessage from 'component/i18nMessage';

export default function NagFatalError() {
  return (
    <Nag
      type="error"
      message={
        <I18nMessage
          tokens={{
            SITE_NAME,
          }}
        >
          There was a problem connecting to your account. Some features will not be available but you can keep enjoying
          content.
        </I18nMessage>
      }
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
    />
  );
}
