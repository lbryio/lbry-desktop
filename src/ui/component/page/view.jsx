// @flow
import type { Node } from 'react';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideBar from 'component/sideBar';
import Header from 'component/header';

type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  fullscreen: boolean,
  authenticated: boolean,
};

function Page(props: Props) {
  const { children, className, fullscreen = false, authenticated } = props;
  const obscureSideBar = IS_WEB ? !authenticated : false;

  return (
    <Fragment>
      <Header minimal={fullscreen} />
      <div className={classnames('main-wrapper__inner')}>
        <main className={classnames('main', className, { 'main--full-width': fullscreen })}>{children}</main>
        {!fullscreen && <SideBar obscureSideBar={obscureSideBar} />}
      </div>
    </Fragment>
  );
}

export default Page;
