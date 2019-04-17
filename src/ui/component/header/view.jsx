// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import WunderBar from 'component/wunderbar';
import Icon from 'component/common/icon';
import styles from './header.module.scss';

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

  const showUpgradeButton =
    autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className={styles.header}>
      <Icon className={styles.menuIcon} icon={ICONS.MENU} />
      <Button
        className={styles.logoIcon}
        description={__('LBRY')}
        icon={ICONS.LBRY}
        title={`LBRY`}
        label={<span className={styles.logoText}>LBRY</span>}
        navigate="/"
      />

      <Button
        className={styles.back}
        description={__('Navigate back')}
        onClick={() => window.history.back()}
        icon={ICONS.ARROW_LEFT}
      />

      <Button
        className={styles.forward}
        description={__('Navigate forward')}
        onClick={() => window.history.forward()}
        icon={ICONS.ARROW_RIGHT}
      />

      <div class={styles.wunderbar}>
        <WunderBar />
      </div>

      <Button
        className={styles.balance}
        description={__('Your wallet')}
        icon={ICONS.WALLET}
        title={`Your balance is ${balance} LBRY Credits`}
        label={
          <React.Fragment>
            {roundedBalance} <LbcSymbol />
          </React.Fragment>
        }
        navigate="/$/account"
      />

      <Button
        className={styles.publish}
        description={__('Publish content')}
        icon={ICONS.UPLOAD}
        label={isUpgradeAvailable ? '' : __('Publish')}
        navigate="/$/publish"
      />

      {/* @if TARGET='app' */}
      {showUpgradeButton && (
        <Button
          className=""
          icon={ICONS.DOWNLOAD}
          label={__('Upgrade App')}
          onClick={downloadUpgradeRequested}
        />
      )}
      {/* @endif */}
    </header>
  );
};

export default Header;
