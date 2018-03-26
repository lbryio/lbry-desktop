// @flow
import * as React from 'react';
import Button from 'component/button';
import WunderBar from 'component/wunderbar';
import * as icons from 'constants/icons';

type Props = {
  balance: string,
  navigate: any => void,
  downloadUpgradeRequested: any => void,
  isUpgradeAvailable: boolean,
  autoUpdateDownloaded: boolean,
};

const Header = (props: Props) => {
  const {
    balance,
    isUpgradeAvailable,
    navigate,
    downloadUpgradeRequested,
    autoUpdateDownloaded,
  } = props;

  const showUpgradeButton =
    autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <WunderBar />
      <div className="header__actions-right">
        <Button
          button="inverse"
          className="btn--header-balance"
          onClick={() => navigate('/wallet')}
          label={
            isUpgradeAvailable ? (
              `${balance}`
            ) : (
              <React.Fragment>
                <span className="btn__label--balance">You have</span> <span>{balance} LBC</span>
              </React.Fragment>
            )
          }
          iconRight="LBC"
          description={__('Your wallet')}
        />

        <Button
          uppercase
          button="primary"
          onClick={() => navigate('/publish')}
          icon={icons.UPLOAD}
          label={isUpgradeAvailable ? '' : __('Publish')}
          description={__('Publish content')}
        />

        {showUpgradeButton && (
          <Button
            button="primary"
            onClick={downloadUpgradeRequested}
            icon={icons.DOWNLOAD}
            label={__('Upgrade App')}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
