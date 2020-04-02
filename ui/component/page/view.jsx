// @flow
import type { Node } from 'react';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideNavigation from 'component/sideNavigation';
import Header from 'component/header';

export const MAIN_CLASS = 'main';
type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  noHeader: boolean,
};

function Page(props: Props) {
  const { children, className, authPage = false, noHeader } = props;

  return (
    <Fragment>
      {!noHeader && <Header authHeader={authPage} />}
      <div className={classnames('main-wrapper__inner')}>
        <main className={classnames(MAIN_CLASS, className, { 'main--full-width': authPage })}>{children}</main>
        {!authPage && !noHeader && <SideNavigation />}
      </div>
    </Fragment>
  );
}

export default Page;
