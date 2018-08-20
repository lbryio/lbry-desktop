// @flow
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import * as NOTIFICATION_TYPES from 'constants/notification_types';

type SideBarLink = {
  label: string,
  path: string,
  active: boolean,
  icon: ?string,
  subLinks: Array<SideBarLink>,
};

type Props = {
  navLinks: {
    primary: Array<SideBarLink>,
    secondary: Array<SideBarLink>,
  },
  notifications: {
    type: string,
  },
};

const SideBar = (props: Props) => {
  const { navLinks, notifications } = props;

  const badges = Object.keys(notifications).length;

  return (
    <nav className="nav">
      <div className="nav__links">
        <ul className="nav__primary">
          {navLinks.primary.map(({ label, path, active, icon }) => (
            <li
              key={path}
              className={classnames('nav__link', {
                'nav__link--active': active,
              })}
            >
              <Button
                navigate={path}
                label={path === '/subscriptions' && badges ? `${label} (${badges})` : label}
                icon={icon}
              />
            </li>
          ))}
        </ul>
        <hr />
        <ul>
          {navLinks.secondary.map(({ label, path, active, icon, subLinks = [] }) => (
            <li
              key={label}
              className={classnames('nav__link', {
                'nav__link--active': active,
              })}
            >
              <Button navigate={path} label={label} icon={icon} />

              {
                // The sublinks should be animated on open close
                // Removing it because the current implementation with CSSTransitionGroup
                // was really slow and looked pretty bad. Possible fix is upgrading to v2
                // Not sure if that has better performance
              }
              {!!subLinks.length &&
                active && (
                  <ul key="0" className="nav__sub-links">
                    {subLinks.map(({ label: subLabel, path: subPath, active: subLinkActive }) => (
                      <li
                        key={subPath}
                        className={classnames('nav__link nav__link--sub', {
                          'nav__link--active': subLinkActive,
                        })}
                      >
                        {subPath ? (
                          <Button navigate={subPath} label={subLabel} />
                        ) : (
                          <span>{subLabel}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
