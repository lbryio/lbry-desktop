// @flow
import * as React from 'react';
import Button from 'component/button';
import WunderBar from 'component/wunderbar';
import * as icons from 'constants/icons';

type Props = {
  autoUpdateDownloaded: boolean,
  balance: string,
  downloadUpgradeRequested: any => void,
  isUpgradeAvailable: boolean,
  navigate: any => void,
  roundedBalance: string,
};

const Header = (props: Props) => {
  const {
    autoUpdateDownloaded,
    balance,
    downloadUpgradeRequested,
    isUpgradeAvailable,
    navigate,
    roundedBalance,
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
                <span className="btn__label--balance" title={`${balance} LBC`}>
                  You have
                </span>{' '}
                <span title={`${balance} LBC`}>{roundedBalance} LBC</span>
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
