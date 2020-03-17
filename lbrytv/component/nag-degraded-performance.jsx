// @flow
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
            more_information: <Button button="link" label={__('more')} href="https://status.lbry.com/" />,
          }}
        >
          lbry.tv performance may be degraded. You can try to use it, or wait 5 minutes and refresh. Please no crush us.
        </I18nMessage>
      }
      actionText={__('Refresh')}
      onClick={() => window.location.reload()}
      onClose={onClose}
    />
  );
}
