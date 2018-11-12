// @flow
import * as React from 'react';
import Button from 'component/button';
import WunderBar from 'component/wunderbar';
import * as icons from 'constants/icons';

type Props = {
  autoUpdateDownloaded: boolean,
  balance: string,
  isUpgradeAvailable: boolean,
  roundedBalance: string,
  isBackDisabled: boolean,
  isForwardDisabled: boolean,
  back: () => void,
  forward: () => void,
  downloadUpgradeRequested: any => void,
  navigate: any => void,
};

const Header = (props: Props) => {
  const {
    autoUpdateDownloaded,
    balance,
    downloadUpgradeRequested,
    isUpgradeAvailable,
    navigate,
    roundedBalance,
    back,
    isBackDisabled,
    forward,
    isForwardDisabled,
  } = props;

  const showUpgradeButton =
    autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <div className="header__navigation">
        <Button
          className="header__navigation__item wallet"
          description={__('Your wallet')}
          iconRight="LBC"
          label={
            isUpgradeAvailable ? (
              `${balance}`
            ) : (
              <React.Fragment>
                <span title={`${balance} LBC`}>{roundedBalance}</span>
              </React.Fragment>
            )
          }
          onClick={() => navigate('/wallet')}
        />

        <Button
          className="header__navigation__item back"
          description={__('Navigate back')}
          disabled={isBackDisabled}
          onClick={back}
        />

        <Button
          className="header__navigation__item forward"
          description={__('Navigate forward')}
          disabled={isForwardDisabled}
          onClick={forward}
        />

        <Button
          className="header__navigation__item home"
          description={__('Home')}
          onClick={() => navigate('/discover')}
        />
      </div>

      <WunderBar />

      {
        // TODO: Make `Menu` add `.active` class to `.navigation` when clicked
      }

      <div className="header__navigation">
        <Button
          className="header__navigation__item menu"
          description={__('Menu')}
        />

        <Button
          className="header__navigation__item publish"
          description={__('Publish content')}
          label={isUpgradeAvailable ? '' : __('Publish')}
          onClick={() => navigate('/publish')}
        />

        {showUpgradeButton && (
          <Button
            button="primary"
            icon={icons.DOWNLOAD}
            label={__('Upgrade App')}
            onClick={downloadUpgradeRequested}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
