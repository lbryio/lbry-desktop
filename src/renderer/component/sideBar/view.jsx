// @flow
import * as React from 'react';
import Button from 'component/link';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import { CSSTransitionGroup } from 'react-transition-group'

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
  isHome: boolean,
  navLinks: {
    primary: Array<SideBarLink>,
    secondary: Array<SideBarLink>,
  },
};

const SideBar = (props: Props) => {
  const { navigate, back, forward, isBackDisabled, isForwardDisabled, isHome, navLinks } = props;
  return (
    <nav className="nav">
      <div className="nav__actions-top">
        <Button
          alt
          icon="Home"
          description={__('Home')}
          onClick={() => navigate('/discover')}
          disabled={isHome}
        />
        <div className="nav__actions-history">
          <Button
            alt
            icon="ArrowLeft"
            description={__('Navigate back')}
            onClick={back}
            disabled={isBackDisabled}
          />
          <Button
            alt
            icon="ArrowRight"
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
              className={classnames('nav__link nav__link--primary', { 'nav__link--active': active })}
            >
              <Button noStyle navigate={path} label={label} icon={icon} />
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
            <Button noStyle navigate={path} label={label} icon={icon} />

            {!!subLinks.length && active && (
                <CSSTransitionGroup
                  transitionAppear
                  transitionLeave
                  transitionAppearTimeout={300}
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={300}
                  transitionName="nav__sub">
                  <ul key="0" className="nav__sub-links">
                  {subLinks.map(({ label: subLabel, path: subPath, active: subLinkActive }) => (
                    <li
                    key={subPath}
                    className={classnames('nav__link--sub', {
                      'nav__link--active': subLinkActive,
                    })}
                    >
                    {subPath ? <Button noStyle navigate={subPath} label={subLabel} /> : <span>{subLabel}</span>}
                    </li>
                  ))}
                  </ul>
                  </CSSTransitionGroup>
                )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};


export default SideBar;
