// @flow
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';

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
  unreadSubscriptionTotal: number,
};

const SideBar = (props: Props) => {
  const { navLinks, unreadSubscriptionTotal } = props;

  return (
    <nav className="navigation">
      <div className="navigation__links">
        {navLinks.primary.map(({ label, path, active }) => (
          <Button
            className={classnames('navigation__link', {
              'navigation__link--active': active,
            })}
            key={path}
            label={
              path === '/subscriptions' && unreadSubscriptionTotal
                ? `${label} (${unreadSubscriptionTotal})`
                : label
            }
            navigate={path}
          />
        ))}

        <ul>
          <li className="navigation__link navigation__link--title">Account</li>

          {navLinks.secondary.map(({ label, path, active, subLinks = [] }) => (
            <li
              className={classnames('navigation__link', {
                'navigation__link--active': active,
              })}
              key={label}
            >
              <Button label={label} navigate={path} />

              {
                // The sublinks should be animated on open close
                // Removing it because the current implementation with CSSTransitionGroup
                // was really slow and looked pretty bad. Possible fix is upgrading to v2
                // Not sure if that has better performance
              }
              {!!subLinks.length && active && (
                <ul key="0" className="navigation__link-items">
                  {subLinks.map(({ active: subLinkActive, label: subLabel, path: subPath }) => (
                    <li
                      className={classnames('navigation__link-item', {
                        'navigation__link-item--active': subLinkActive,
                      })}
                      key={subPath}
                    >
                      {subPath ? (
                        <Button label={subLabel} navigate={subPath} />
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
