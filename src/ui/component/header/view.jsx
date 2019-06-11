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
  roundedBalance: number,
  downloadUpgradeRequested: any => void,
};

const Header = (props: Props) => {
  const { autoUpdateDownloaded, downloadUpgradeRequested, isUpgradeAvailable, roundedBalance } = props;

  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <div className="title-bar" />
      <div className="header__contents">
        <div className="header__navigation">
          <Button
            className="header__navigation-item header__navigation-item--lbry"
            label={__('LBRY')}
            icon={ICONS.LBRY}
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
            className="header__navigation-item header__navigation-item--right-action"
            activeClass="header__navigation-item--active"
            label={
              roundedBalance > 0 ? (
                <React.Fragment>
                  {roundedBalance} <LbcSymbol />
                </React.Fragment>
              ) : (
                __('Account')
              )
            }
            icon={ICONS.ACCOUNT}
            navigate="/$/account"
          />

          <Button
            className="header__navigation-item header__navigation-item--right-action"
            activeClass="header__navigation-item--active"
            description={__('Publish content')}
            icon={ICONS.UPLOAD}
            iconSize={24}
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

          <Button
            className="header__navigation-item header__navigation-item--right-action"
            activeClass="header__navigation-item--active"
            icon={ICONS.SETTINGS}
            iconSize={24}
            navigate="/$/settings"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
