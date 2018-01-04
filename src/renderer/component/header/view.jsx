// @flow
import React from 'react';
import Button from 'component/link';
import WunderBar from 'component/wunderbar';

type Props = {
  balance: string,
  back: any => void,
  forward: any => void,
  isBackDisabled: boolean,
  isForwardDisabled: boolean,
  isUpgradeAvailable: boolean,
  navigate: any => void,
  downloadUpgrade: any => void,
};

export const Header = (props: Props) => {
  const {
    balance,
    back,
    forward,
    isBackDisabled,
    isForwardDisabled,
    isUpgradeAvailable,
    navigate,
    downloadUpgrade,
  } = props;
  return (
    <header id="header">
      <div className="header__actions-left">
        <Button
          alt
          circle
          onClick={back}
          disabled={isBackDisabled}
          icon="arrow-left"
          description={__('Navigate back')}
        />

        <Button
          alt
          circle
          onClick={forward}
          disabled={isForwardDisabled}
          icon="arrow-right"
          description={__('Navigate forward')}
        />

        <Button alt onClick={() => navigate('/discover')} icon="home" description={__('Home')} />
      </div>

      <WunderBar />

      <div className="header__actions-right">
        <Button
          inverse
          onClick={() => navigate('/wallet')}
          icon="user"
          label={isUpgradeAvailable ? `${balance} LBC` : `You have ${balance} LBC`}
          title={__('Wallet')}
        />

        <Button
          onClick={() => navigate('/publish')}
          icon="cloud-upload"
          label={isUpgradeAvailable ? '' : __('Publish')}
        />

        <Button alt onClick={() => navigate('/settings')} icon="gear" title={__('Settings')} />

        <Button alt onClick={() => navigate('/help')} icon="question" title={__('Help')} />
        {isUpgradeAvailable && (
          <Button
            onClick={() => downloadUpgrade()}
            icon="arrow-up"
            label={__('Upgrade App')}
            title={__('Upgrade app')}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
