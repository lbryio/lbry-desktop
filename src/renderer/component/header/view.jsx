// @flow
import React from 'react';
import Button from 'component/link';
import WunderBar from 'component/wunderbar';

type Props = {
  balance: string,
  navigate: any => void,
  downloadUpgrade: any => void,
  isUpgradeAvailable: boolean,
  autoUpdateDownloaded: boolean
};

const Header = (props: Props) => {
  const { balance, isUpgradeAvailable, navigate, downloadUpgrade, autoUpdateDownloaded } = props;
  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <WunderBar />
      <div className="header__actions-right">
        <Button
          inverse
          onClick={() => navigate('/wallet')}
          icon="User"
          label={isUpgradeAvailable ? `${balance} LBC` : `You have ${balance} LBC`}
          description={__('Your wallet')}
        />

        <Button
          onClick={() => navigate('/publish')}
          icon="UploadCloud"
          label={isUpgradeAvailable ? '' : __('Publish')}
          description={__('Publish content')}
        />

        {showUpgradeButton && (
          <Button onClick={() => downloadUpgrade()} icon="Download" label={__('Upgrade App')} />
        )}
      </div>
    </header>
  );
};

export default Header;
