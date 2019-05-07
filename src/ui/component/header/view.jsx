// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';

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
};

const Header = (props: Props) => {
  const {
    autoUpdateDownloaded,
    balance,
    downloadUpgradeRequested,
    isUpgradeAvailable,
    roundedBalance,
    back,
    isBackDisabled,
    forward,
    isForwardDisabled,
  } = props;

  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <div className="header__navigation">
        <Button
          className="header__navigation-item header__navigation-item--lbry"
          label={__('LBRY')}
          iconRight={ICONS.LBRY}
          navigate="/"
        />
        {/* @if TARGET='app' */}
        <div className="header__navigation-arrows">
          <Button
            className="header__navigation-item header__navigation-item--back"
            description={__('Navigate back')}
            onClick={() => window.history.back()}
            icon={ICONS.ARROW_LEFT}
            iconSize={15}
          />

          <Button
            className="header__navigation-item header__navigation-item--forward"
            description={__('Navigate forward')}
            onClick={() => window.history.forward()}
            icon={ICONS.ARROW_RIGHT}
            iconSize={15}
          />
        </div>
        {/* @endif */}
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
          activeClass="header__navigation-item--active"
          description={__('Your wallet')}
          title={`Your balance is ${balance} LBRY Credits`}
          label={
            <React.Fragment>
              {roundedBalance} <LbcSymbol />
            </React.Fragment>
          }
          navigate="/$/account"
        />

        <Button
          className="header__navigation-item header__navigation-item--right-action"
          activeClass="header__navigation-item--active"
          description={__('Publish content')}
          icon={ICONS.UPLOAD}
          iconSize={24}
          label={isUpgradeAvailable ? '' : __('Publish')}
          navigate="/$/publish"
        />

        {/* @if TARGET='app' */}

        {showUpgradeButton && (
          <Button
            className="header__navigation-item header__navigation-item--right-action header__navigation-item--upgrade"
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
