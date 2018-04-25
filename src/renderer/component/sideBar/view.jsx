// @flow
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import * as icons from 'constants/icons';
import * as NOTIFICATION_TYPES from 'constants/notification_types';

type SideBarLink = {
  label: string,
  path: string,
  active: boolean,
  icon: ?string,
  subLinks: Array<SideBarLink>,
};

type Props = {
  navigate: any => void,
  back: any => void,
  forward: any => void,
  isBackDisabled: boolean,
  isForwardDisabled: boolean,
  navLinks: {
    primary: Array<SideBarLink>,
    secondary: Array<SideBarLink>,
  },
  notifications: {
    type: string,
  },
};

const SideBar = (props: Props) => {
  const {
    navigate,
    back,
    forward,
    isBackDisabled,
    isForwardDisabled,
    navLinks,
    notifications,
  } = props;

  const badges = Object.keys(notifications).reduce(
    (acc, cur) => (notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING ? acc : acc + 1),
    0
  );

  return (
    <nav className="nav">
      <div className="nav__actions-top">
        <Button
          noPadding
          button="alt"
          icon={icons.HOME}
          className="btn--home-nav"
          description={__('Home')}
          onClick={() => navigate('/discover')}
        />
        <div className="nav__actions-history">
          <Button
            className="btn--arrow"
            icon={icons.ARROW_LEFT}
            description={__('Navigate back')}
            onClick={back}
            disabled={isBackDisabled}
          />
          <Button
            className="btn--arrow"
            icon={icons.ARROW_RIGHT}
            description={__('Navigate forward')}
            onClick={forward}
            disabled={isForwardDisabled}
          />
        </div>
      </div>

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
