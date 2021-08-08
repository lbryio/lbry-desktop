// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import { SETTINGS_GRP } from 'constants/settings';
import type { Node } from 'react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import Button from 'component/button';
// @if TARGET='app'
import { IS_MAC } from 'component/app/view';
// @endif
import { useIsMediumScreen } from 'effects/use-screensize';

type SideNavLink = {
  title: string,
  link?: string,
  route?: string,
  section?: string,
  onClick?: () => any,
  icon: string,
  extra?: Node,
};

const SIDE_LINKS: Array<SideNavLink> = [
  {
    title: 'Appearance',
    link: `/$/${PAGES.SETTINGS}#${SETTINGS_GRP.APPEARANCE}`,
    section: SETTINGS_GRP.APPEARANCE,
    icon: ICONS.APPEARANCE,
  },
  {
    title: 'Account',
    link: `/$/${PAGES.SETTINGS}#${SETTINGS_GRP.ACCOUNT}`,
    section: SETTINGS_GRP.ACCOUNT,
    icon: ICONS.ACCOUNT,
  },
  {
    title: 'Content settings',
    link: `/$/${PAGES.SETTINGS}#${SETTINGS_GRP.CONTENT}`,
    section: SETTINGS_GRP.CONTENT,
    icon: ICONS.CONTENT,
  },
  {
    title: 'System',
    link: `/$/${PAGES.SETTINGS}#${SETTINGS_GRP.SYSTEM}`,
    section: SETTINGS_GRP.SYSTEM,
    icon: ICONS.SETTINGS,
  },
];

export default function SettingsSideNavigation() {
  const sidebarOpen = true;
  const isMediumScreen = useIsMediumScreen();
  const isAbsolute = isMediumScreen;
  const microNavigation = !sidebarOpen || isMediumScreen;
  const { location } = useHistory();

  // This sidebar could be called from Settings or from a Settings Sub Page.
  //  - "#" navigation = don't record to history, just scroll.
  //  - "/" navigation = record sub-page navigation to history.
  const scrollInstead = location.pathname === `/$/${PAGES.SETTINGS}`;

  function scrollToSection(section: string) {
    const TOP_MARGIN_PX = 20;
    const element = document.getElementById(section);
    if (element) {
      window.scrollTo(0, element.offsetTop - TOP_MARGIN_PX);
    }
  }

  if (isMediumScreen) {
    // I think it's ok to hide it for now on medium/small screens given that
    // we are using a scrolling Settings Page that displays everything. If we
    // really need this, most likely we can display it as a Tab at the top
    // of the page.
    return null;
  }

  return (
    <div
      className={classnames('navigation__wrapper', {
        'navigation__wrapper--micro': microNavigation,
        'navigation__wrapper--absolute': isAbsolute,
      })}
    >
      <nav
        aria-label={'Sidebar'}
        className={classnames('navigation', {
          'navigation--micro': microNavigation,
          // @if TARGET='app'
          'navigation--mac': IS_MAC,
          // @endif
        })}
      >
        <div>
          <ul className={classnames('navigation-links', { 'navigation-links--micro': !sidebarOpen })}>
            {SIDE_LINKS.map((linkProps) => {
              return (
                <li key={linkProps.route || linkProps.link}>
                  <Button
                    {...linkProps}
                    label={__(linkProps.title)}
                    title={__(linkProps.title)}
                    navigate={scrollInstead ? undefined : linkProps.route || linkProps.link}
                    icon={linkProps.icon}
                    className={classnames('navigation-link', {})}
                    // $FlowFixMe
                    onClick={scrollInstead && linkProps.section ? () => scrollToSection(linkProps.section) : undefined}
                  />
                  {linkProps.extra && linkProps.extra}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {isMediumScreen && sidebarOpen && (
        <>
          <nav
            className={classnames('navigation--absolute', {
              // @if TARGET='app'
              'navigation--mac': IS_MAC,
              // @endif
            })}
          >
            <div>
              <ul className="navigation-links--absolute">
                {SIDE_LINKS.map((linkProps) => {
                  // $FlowFixMe
                  const { link, route, ...passedProps } = linkProps;
                  return (
                    <li key={route || link}>
                      <Button
                        {...passedProps}
                        navigate={scrollInstead ? undefined : route || link}
                        label={__(linkProps.title)}
                        title={__(linkProps.title)}
                        icon={linkProps.icon}
                        className={classnames('navigation-link', {})}
                        onClick={
                          // $FlowFixMe
                          scrollInstead && linkProps.section ? () => scrollToSection(linkProps.section) : undefined
                        }
                      />
                      {linkProps.extra && linkProps.extra}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
