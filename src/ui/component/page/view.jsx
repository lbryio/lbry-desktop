// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  children: React.Node | Array<React.Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  doDownloadUpgradeRequested: () => void,
};

function Page(props: Props) {
  const { children, className, autoUpdateDownloaded, isUpgradeAvailable, doDownloadUpgradeRequested } = props;
  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <main className={classnames('main', className)}>
      {/* @if TARGET='app' */}
      {showUpgradeButton && (
        <div className="main__status">
          {__('Upgrade is ready')}
          <Button button="alt" icon={ICONS.DOWNLOAD} label={__('Install now')} onClick={doDownloadUpgradeRequested} />
        </div>
      )}
      {/* @endif */}
      {children}
    </main>
  );
}

export default Page;
