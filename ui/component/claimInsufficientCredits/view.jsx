// @flow
import * as React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  uri: string,
  fileInfo: FileListItem,
  isInsufficientCredits: boolean,
};

function ClaimInsufficientCredits(props: Props) {
  const { isInsufficientCredits, fileInfo } = props;

  if (fileInfo || !isInsufficientCredits) {
    return null;
  }

  return (
    <div className="media__insufficient-credits help--warning">
      <I18nMessage
        tokens={{
          reward_link: <Button button="link" navigate="/$/rewards" label={__('Rewards')} />,
        }}
      >
        The publisher has chosen to charge LBC to view this content. Your balance is currently too low to view it. Check
        out %reward_link% for free LBC or send more LBC to your wallet.
      </I18nMessage>
    </div>
  );
}

export default ClaimInsufficientCredits;
