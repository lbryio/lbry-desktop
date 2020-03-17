// @flow
import React from 'react';
import Nag from 'component/common/nag';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import useIsMobile from 'effects/use-is-mobile';

type Props = {
  onClose: () => void,
};

export default function NagDegradedPerformance(props: Props) {
  const { onClose } = props;
  const isMobile = useIsMobile();

  return (
    <React.Fragment>
      {isMobile ? (
        <Nag
          message={
            <I18nMessage
              tokens={{
                more_information: (
                  <Button button="link" label={__('more')} href="https://lbry.com/faq/privacy-and-data" />
                ),
              }}
            >
              lbry.tv collects usage information for itself and third parties (%more_information%).
            </I18nMessage>
          }
          actionText={__('OK')}
          onClick={onClose}
        />
      ) : (
        <Nag
          message={
            <I18nMessage
              tokens={{
                more_information: (
                  <Button button="link" label={__('more')} href="https://lbry.com/faq/privacy-and-data" />
                ),
              }}
            >
              lbry.tv collects usage information for itself and third parties (%more_information%). Want control over
              this and more?
            </I18nMessage>
          }
          actionText={__('Get The App')}
          href="https://lbry.com/get"
          onClose={onClose}
        />
      )}
    </React.Fragment>
  );
}
