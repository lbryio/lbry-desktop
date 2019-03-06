// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';

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
          className="header__navigation-item header__navigation-item--wallet"
          description={__('Your wallet')}
          title={`Your balance is ${balance} LBRY Credits`}
          label={
            <React.Fragment>
              <span>{roundedBalance}</span>
              <LbcSymbol />
            </React.Fragment>
          }
          onClick={() => navigate('/wallet')}
        />

        <Button
          className="header__navigation-item header__navigation-item--back"
          description={__('Navigate back')}
          disabled={isBackDisabled}
          icon={ICONS.ARROW_LEFT}
          iconSize={15}
          onClick={back}
        />

        <Button
          className="header__navigation-item header__navigation-item--forward"
          description={__('Navigate forward')}
          disabled={isForwardDisabled}
          icon={ICONS.ARROW_RIGHT}
          iconSize={15}
          onClick={forward}
        />

        <Button
          className="header__navigation-item header__navigation-item--home"
          description={__('Home')}
          icon={ICONS.HOME}
          iconSize={15}
          onClick={() => navigate('/discover')}
        />
      </div>

      <WunderBar />

      <div className="header__navigation">
        <Button
          className="header__navigation-item header__navigation-item--menu"
          description={__('Menu')}
          icon={ICONS.MENU}
          iconSize={15}
        />

        <Button
          className="header__navigation-item header__navigation-item--right-action"
          description={__('Publish content')}
          icon={ICONS.UPLOAD}
          iconSize={24}
          label={isUpgradeAvailable ? '' : __('Publish')}
          onClick={() => navigate('/publish')}
        />

        {/* @if TARGET='app' */}

        {showUpgradeButton && (
          <Button
            className="header__navigation-item header__navigation-item--right-action"
            icon={ICONS.DOWNLOAD}
            iconSize={24}
            label={__('Upgrade App')}
            onClick={downloadUpgradeRequested}
          />
        )}
        {/* @endif */}
      </div>
    </header>
  );
};

export default Header;
