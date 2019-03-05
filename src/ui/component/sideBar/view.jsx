// @flow
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Tooltip from 'component/common/tooltip';

type SideBarLink = {
  label: string,
  path: string,
  active: boolean,
  icon: ?string,
  subLinks: Array<SideBarLink>,
  guide: ?string,
};

type Props = {
  navLinks: {
    primary: Array<SideBarLink>,
    secondary: Array<SideBarLink>,
  },
  unreadSubscriptionTotal: number,
};

class SideBar extends React.PureComponent<Props> {
  renderNavLink(navLink: SideBarLink) {
    const { label, path, active, subLinks = [], icon, guide } = navLink;

    const inner = (
      <li
        className={classnames('navigation__link', {
          'navigation__link--active': active,
          'navigation__link--guide': guide,
        })}
        key={label}
      >
        <Button icon={icon} label={label} navigate={path} />

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
                {subPath ? <Button label={subLabel} navigate={subPath} /> : <span>{subLabel}</span>}
              </li>
            ))}
          </ul>
        )}
      </li>
    );

    return guide ? (
      <Tooltip key={guide} alwaysVisible direction="right" body={guide}>
        {inner}
      </Tooltip>
    ) : (
      inner
    );
  }

  render() {
    const { navLinks, unreadSubscriptionTotal } = this.props;

    return (
      <nav className="navigation">
        <div className="navigation__links">
          {navLinks.primary.map(({ label, path, active, icon }) => (
            <Button
              icon={icon}
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
            {navLinks.secondary.map(this.renderNavLink)}
          </ul>
        </div>
      </nav>
    );
  }
}

export default SideBar;
