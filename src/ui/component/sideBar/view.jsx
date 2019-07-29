// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import StickyBox from 'react-sticky-box/dist/esnext';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
};

function SideBar(props: Props) {
  const { subscriptions, followedTags } = props;

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
      <nav className="navigation">
        <ul className="navigation-links">
          {[
            {
              ...buildLink(null, __('Home'), ICONS.HOME),
            },
            {
              ...buildLink(PAGES.LIBRARY, __('Library'), ICONS.LIBRARY),
            },
            {
              ...buildLink(PAGES.PUBLISHED, __('Publishes'), ICONS.PUBLISH),
            },
            {
              ...buildLink(PAGES.FOLLOWING, __('Customize'), ICONS.EDIT),
            },
          ].map(linkProps => (
            <li key={linkProps.label}>
              <Button {...linkProps} className="navigation-link" activeClass="navigation-link--active" />
            </li>
          ))}
        </ul>
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
      </nav>
    </StickyBox>
  );
}

export default SideBar;
