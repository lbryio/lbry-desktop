// @flow
import { MAIN_CLASS } from 'constants/classnames';
import { parseURI } from 'util/lbryURI';
import { useHistory } from 'react-router';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import classnames from 'classnames';
import Header from 'component/header';
import React from 'react';
import Wallpaper from 'component/wallpaper';
import SettingsSideNavigation from 'component/settingsSideNavigation';
import SideNavigation from 'component/sideNavigation';
import StatusBar from 'component/common/status-bar';
import usePersistedState from 'effects/use-persisted-state';
import type { Element, Node } from 'react';

type Props = {
  className: ?string,
  autoUpdateDownloaded: boolean,
  isUpgradeAvailable: boolean,
  authPage: boolean,
  backout: {
    backLabel?: string,
    backNavDefault?: string,
    title: string,
    simpleTitle: string, // Just use the same value as `title` if `title` is already short (~< 10 chars), unless you have a better idea for title overlfow on mobile
  },
  children: Node | Array<Node>,
  className: ?string,
  filePage: boolean,
  fullWidthPage: boolean,
  isMarkdown?: boolean,
  noHeader: boolean,
  noSideNavigation: boolean,
  rightSide?: Element<any>,
  settingsPage?: boolean,
  videoTheaterMode: boolean,
};

function Page(props: Props) {
  const {
    authPage = false,
    backout,
    children,
    className,
    filePage = false,
    fullWidthPage = false,
    isMarkdown = false,
    noHeader = false,
    noSideNavigation = false,
    rightSide,
    settingsPage,
    videoTheaterMode,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const isMediumScreen = useIsMediumScreen();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = usePersistedState('sidebar', false);

  const url = pathname.slice(1).replace(/:/g, '#');
  let isOnFilePage = false;
  try {
    const { isChannel } = parseURI(url);

    if (!isChannel) isOnFilePage = true;
  } catch (e) {}

  const isAbsoluteSideNavHidden = (isOnFilePage || isMobile) && !sidebarOpen;

  React.useEffect(() => {
    if (isOnFilePage || isMediumScreen) setSidebarOpen(false);

    // TODO: make sure setState callback for usePersistedState uses useCallback to it doesn't cause effect to re-run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnFilePage, isMediumScreen]);

  return (
    <>
      <Wallpaper uri={url} />
      {!noHeader && (
        <Header
          authHeader={authPage}
          backout={backout}
          sidebarOpen={sidebarOpen}
          isAbsoluteSideNavHidden={isAbsoluteSideNavHidden}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      <div
        className={classnames('main-wrapper__inner', {
          'main-wrapper__inner--filepage': isOnFilePage,
          'main-wrapper__inner--theater-mode': isOnFilePage && videoTheaterMode,
        })}
      >
        {!authPage &&
          (settingsPage ? (
            <SettingsSideNavigation />
          ) : (
            !noSideNavigation && (
              <SideNavigation
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMediumScreen={isMediumScreen}
                isOnFilePage={isOnFilePage}
              />
            )
          ))}

        <div
          className={classnames({
            'sidebar--pusher': fullWidthPage,
            'sidebar--pusher--open': sidebarOpen && fullWidthPage,
            'sidebar--pusher--filepage': !fullWidthPage,
          })}
        >
          <main
            id={'main-content'}
            className={classnames(MAIN_CLASS, className, {
              'main--full-width': fullWidthPage,
              'main--auth-page': authPage,
              'main--file-page': filePage,
              'main--settings-page': settingsPage,
              'main--markdown': isMarkdown,
              'main--theater-mode': isOnFilePage && videoTheaterMode && !isMarkdown,
            })}
          >
            {children}

            {!isMobile && rightSide && <div className="main__right-side">{rightSide}</div>}
          </main>
          <StatusBar />
        </div>
      </div>
    </>
  );
}

export default Page;
