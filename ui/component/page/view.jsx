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
import usePersistedState from 'effects/use-persisted-state';
import { useHistory } from 'react-router';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import { parseURI } from 'lbry-redux';

export const MAIN_CLASS = 'main';
type Props = {
  children: Node | Array<Node>,
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  filePage: boolean,
  homePage: boolean,
  noHeader: boolean,
  noFooter: boolean,
  noSideNavigation: boolean,
  fullWidthPage: boolean,
  backout: {
    backLabel?: string,
    backNavDefault?: string,
    title: string,
    simpleTitle: string, // Just use the same value as `title` if `title` is already short (~< 10 chars), unless you have a better idea for title overlfow on mobile
  },
};

function Page(props: Props) {
  const {
    children,
    className,
    filePage = false,
    authPage = false,
    fullWidthPage = false,
    noHeader = false,
    noFooter = false,
    noSideNavigation = false,
    backout,
  } = props;
  const {
    location: { pathname },
  } = useHistory();
  const [sidebarOpen, setSidebarOpen] = usePersistedState('sidebar', true);
  const isMediumScreen = useIsMediumScreen();
  const isMobile = useIsMobile();

  let isOnFilePage = false;
  try {
    const url = pathname.slice(1).replace(/:/g, '#');
    const { isChannel } = parseURI(url);
    if (!isChannel) {
      isOnFilePage = true;
    }
  } catch (e) {}

  const isAbsoluteSideNavHidden = (isOnFilePage || isMobile) && !sidebarOpen;

  React.useEffect(() => {
    if (isOnFilePage || isMediumScreen) {
      setSidebarOpen(false);
    }
  }, [isOnFilePage, isMediumScreen]);

  return (
    <Fragment>
      {!noHeader && (
        <Header
          authHeader={authPage}
          backout={backout}
          sidebarOpen={sidebarOpen}
          isAbsoluteSideNavHidden={isAbsoluteSideNavHidden}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      <div className={classnames('main-wrapper__inner', { 'main-wrapper__inner--filepage': isOnFilePage })}>
        {!authPage && !noSideNavigation && (
          <SideNavigation
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMediumScreen={isMediumScreen}
            isOnFilePage={isOnFilePage}
          />
        )}
        <main
          className={classnames(MAIN_CLASS, className, {
            'main--full-width': fullWidthPage,
            'main--auth-page': authPage,
            'main--file-page': filePage,
          })}
        >
          {children}
        </main>
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
