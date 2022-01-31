// @flow
import { DOMAIN } from 'config';
import React from 'react';
import Nag from 'component/common/nag';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';

type Props = {
  onClose: () => void,
};

export default function NagDegradedPerformance(props: Props) {
  const { onClose } = props;

  return (
    <Nag
      type="error"
      message={
        <I18nMessage
          tokens={{
            DOMAIN,
            more_information: (
              <Button button="link" label={__('more')} href="https://odysee.com/@OdyseeHelp:b?view=about" />
            ),
          }}
        >
          %DOMAIN% performance may be degraded. You can try to use it, or wait 5 minutes and refresh. Please no crush
          us.
        </I18nMessage>
      }
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
      onClose={onClose}
    />
  );
}
