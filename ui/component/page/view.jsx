// @flow
import type { Node } from 'react';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideNavigation from 'component/sideNavigation';
import Header from 'component/header';
import Footer from 'web/component/footer';
/* @if TARGET='app' */
import StatusBar from 'component/common/status-bar';
/* @endif */

export const MAIN_CLASS = 'main';
type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  noHeader: boolean,
  noFooter: boolean,
  noSideNavigation: boolean,
  backout: { backFunction: () => void, backTitle: string },
};

function Page(props: Props) {
  const {
    children,
    className,
    authPage = false,
    noHeader = false,
    noFooter = false,
    noSideNavigation = false,
    backout,
  } = props;

  return (
    <Fragment>
      {!noHeader && <Header authHeader={authPage} backout={backout} />}
      <div className={classnames('main-wrapper__inner')}>
        {!authPage && !noSideNavigation && <SideNavigation />}
        <main className={classnames(MAIN_CLASS, className, { 'main--full-width': authPage })}>{children}</main>
        {/* @if TARGET='app' */}
        <StatusBar />
        {/* @endif */}
      </div>
      {/* @if TARGET='web' */}
      {!noFooter && <Footer />}
      {/* @endif */}
    </Fragment>
  );
}

export default Page;
