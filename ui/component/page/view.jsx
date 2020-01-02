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
  authenticated: boolean,
};

function Page(props: Props) {
  const { children, className, authPage = false, authenticated } = props;
  const obscureSideNavigation = IS_WEB ? !authenticated : false;

  return (
    <Fragment>
      <Header authHeader={authPage} />
      <div className={classnames('main-wrapper__inner')}>
        <main className={classnames(MAIN_CLASS, className, { 'main--full-width': authPage })}>{children}</main>
        {!authPage && <SideNavigation obscureSideNavigation={obscureSideNavigation} />}
      </div>
    </Fragment>
  );
}

export default Page;
