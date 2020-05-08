// @flow
import type { Node } from 'react';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import SideNavigation from 'component/sideNavigation';
import Header from 'component/header';
import Footer from 'lbrytv/component/footer';

export const MAIN_CLASS = 'main';
type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  noHeader: boolean,
  noFooter: boolean,
};

function Page(props: Props) {
  const { children, className, authPage = false, noHeader, noFooter } = props;

  return (
    <Fragment>
      {!noHeader && <Header authHeader={authPage} />}
      <div className={classnames('main-wrapper__inner')}>
        <main className={classnames(MAIN_CLASS, className, { 'main--full-width': authPage })}>{children}</main>
        {!authPage && !noHeader && <SideNavigation />}
      </div>
      {/* @if TARGET='web' */}
      {!noFooter && <Footer />}
      {/* @endif */}
    </Fragment>
  );
}

export default Page;
