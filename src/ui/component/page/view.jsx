// @flow
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import Button from 'component/button';

type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  fullscreen: boolean,
  doDownloadUpgradeRequested: () => void,
};

function Page(props: Props) {
  const {
    children,
    className,
    fullscreen = false,
    autoUpdateDownloaded,
    isUpgradeAvailable,
    doDownloadUpgradeRequested,
  } = props;
  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <Fragment>
      <Header minimal={fullscreen} />
      <div className={classnames('main-wrapper__inner')}>
        {/* @if TARGET='app' */}
        {showUpgradeButton && (
          <div className="main__status">
            {__('Upgrade is ready')}
            <Button button="alt" icon={ICONS.DOWNLOAD} label={__('Install now')} onClick={doDownloadUpgradeRequested} />
          </div>
        )}
        {/* @endif */}

        <main className={classnames('main', className)}>{children}</main>
        {!fullscreen && <SideBar />}
      </div>
    </Fragment>
  );
}

export default Page;
