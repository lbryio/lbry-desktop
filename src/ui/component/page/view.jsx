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
  authPage: boolean,
  authenticated: boolean,
};

function Page(props: Props) {
  const { children, className, authPage = false, authenticated } = props;
  const obscureSideBar = IS_WEB ? !authenticated : false;

  return (
    <Fragment>
      <Header authHeader={authPage} />
      <div className={classnames('main-wrapper__inner')}>
        <main className={classnames('main', className, { 'main--full-width': authPage })}>{children}</main>
        {!authPage && <SideBar obscureSideBar={obscureSideBar} />}
      </div>
    </Fragment>
  );
}

export default Page;
