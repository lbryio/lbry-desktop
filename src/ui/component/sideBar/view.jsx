// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
};

function SideBar(props: Props) {
  const { subscriptions, followedTags, email } = props;
  const showSideBar = IS_WEB ? Boolean(email) : true;

  function buildLink(path, label, icon, guide) {
    return {
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
      guide,
    };
  }

  return (
    <StickyBox offsetTop={100} offsetBottom={20}>
      {showSideBar ? (
        <nav className="navigation">
          <ul className="navigation-links">
            {[
              {
                ...buildLink(null, __('Home'), ICONS.HOME),
              },
              // @if TARGET='app'
              {
                ...buildLink(PAGES.LIBRARY, __('Library'), ICONS.LIBRARY),
              },
              // @endif
              {
                ...buildLink(PAGES.PUBLISHED, __('Publishes'), ICONS.PUBLISH),
              },
            ].map(linkProps => (
              <li key={linkProps.label}>
                <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
              </li>
            ))}
          </ul>

          {email ? (
            <Fragment>
              <Button
                navigate={`/$/${PAGES.FOLLOWING}`}
                label={__('Customize')}
                icon={ICONS.EDIT}
                className="navigation-link"
                activeClass="navigation-link--active"
              />
              <ul className="navigation-links tags--vertical">
                {followedTags.map(({ name }, key) => (
                  <li className="navigation-link__wrapper" key={name}>
                    <Tag navigate={`/$/tags?t${name}`} name={name} />
                  </li>
                ))}
              </ul>
              <ul className="navigation-links--small">
                {subscriptions.map(({ uri, channelName }, index) => (
                  <li key={uri} className="navigation-link__wrapper">
                    <Button
                      navigate={uri}
                      label={channelName}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                  </li>
                ))}
              </ul>
            </Fragment>
          ) : (
            <div className="navigation--placeholder" style={{ height: '20vh', marginTop: '1rem', padding: '1rem' }}>
              Something about logging up to customize here
            </div>
          )}
        </nav>
      ) : (
        <div className="navigation--placeholder" />
      )}
    </StickyBox>
  );
}

export default SideBar;
