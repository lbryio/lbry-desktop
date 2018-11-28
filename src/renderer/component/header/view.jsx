// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
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
          noPadding
          button="alt"
          icon={ICONS.HOME}
          className="btn--home-nav"
          description={__('Home')}
          onClick={() => navigate('/discover')}
        />
        <div className="header__history">
          <Button
            className="btn--arrow"
            icon={ICONS.ARROW_LEFT}
            description={__('Navigate back')}
            onClick={back}
            disabled={isBackDisabled}
          />
          <Button
            className="btn--arrow"
            icon={ICONS.ARROW_RIGHT}
            description={__('Navigate forward')}
            onClick={forward}
            disabled={isForwardDisabled}
          />
        </div>
      </div>
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
          className="btn--header-publish"
          onClick={() => navigate('/publish')}
          icon={ICONS.UPLOAD}
          label={isUpgradeAvailable ? '' : __('Publish')}
          description={__('Publish content')}
        />

        {showUpgradeButton && (
          <Button
            button="primary"
            onClick={downloadUpgradeRequested}
            icon={ICONS.DOWNLOAD}
            label={__('Upgrade App')}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
