// @flow
import * as React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  uri: string,
  fileInfo: FileListItem,
  isInsufficientCredits: boolean,
  claimWasPurchased: boolean,
};

function ClaimInsufficientCredits(props: Props) {
  const { isInsufficientCredits, fileInfo, claimWasPurchased } = props;

  if (fileInfo || !isInsufficientCredits || claimWasPurchased) {
    return null;
  }

  return (
    <div className="media__insufficient-credits help--warning">
      <I18nMessage
        tokens={{
          reward_link: <Button button="link" navigate="/$/rewards" label={__('Rewards')} />,
          buy_link: <Button button="link" navigate="/$/buy" label={__('buy')} />,
        }}
      >
        The publisher has chosen to charge LBC to view this content. Your balance is currently too low to view it. Check
        out %reward_link% for free LBC or send more LBC to your wallet. You can also %buy_link% more LBC.
      </I18nMessage>
    </div>
  );
}

export default ClaimInsufficientCredits;
