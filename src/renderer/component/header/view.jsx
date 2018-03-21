import React from 'react';
import Link from 'component/link';
import WunderBar from 'component/wunderbar';

export const Header = props => {
  const {
    balance,
    back,
    forward,
    isBackDisabled,
    isForwardDisabled,
    isUpgradeAvailable,
    autoUpdateDownloaded,
    navigate,
    downloadUpgradeRequested,
  } = props;
  return (
    <header id="header">
      <div className="header__item">
        <Link
          onClick={back}
          disabled={isBackDisabled}
          button="alt button--flat"
          icon="icon-arrow-left"
          title={__('Back')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={forward}
          disabled={isForwardDisabled}
          button="alt button--flat"
          icon="icon-arrow-right"
          title={__('Forward')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/discover')}
          button="alt button--flat"
          icon="icon-home"
          title={__('Discover Content')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/subscriptions')}
          button="alt button--flat"
          icon="icon-at"
          title={__('My Subscriptions')}
        />
      </div>
      <div className="header__item header__item--wunderbar">
        <WunderBar />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/wallet')}
          button="text"
          className="no-underline"
          icon="icon-bank"
          label={balance}
          title={__('Wallet')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/publish')}
          button="primary button--flat"
          icon="icon-upload"
          label={__('Publish')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/downloaded')}
          button="alt button--flat"
          icon="icon-folder"
          title={__('Downloads and Publishes')}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate('/settings')}
          button="alt button--flat"
          icon="icon-gear"
          title={__('Settings')}
        />
      </div>
      {(autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable)) && (
        <Link
          onClick={() => downloadUpgradeRequested()}
          button="primary button--flat"
          icon="icon-arrow-up"
          label={__('Upgrade App')}
        />
      )}
    </header>
  );
};

export default Header;
