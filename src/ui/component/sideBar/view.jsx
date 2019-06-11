// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
};

function SideBar(props: Props) {
  const { subscriptions, followedTags } = props;
  const buildLink = (path, label, icon, guide) => ({
    navigate: path ? `$/${path}` : '/',
    label,
    icon,
    guide,
  });

  const renderLink = linkProps => (
    <Button {...linkProps} key={linkProps.label} className="navigation__link" activeClass="navigation__link--active" />
  );

  return (
    <div className="navigation-wrapper">
      <nav className="navigation">
        <ul className="navigation__links">
          {[
            {
              ...buildLink(null, __('Home'), ICONS.HOME),
            },
            {
              ...buildLink(PAGES.SUBSCRIPTIONS, __('Subscriptions'), ICONS.SUBSCRIPTION),
            },
            {
              ...buildLink(PAGES.PUBLISHED, __('Publishes'), ICONS.PUBLISHED),
            },
            {
              ...buildLink(PAGES.LIBRARY, __('Library'), ICONS.DOWNLOAD),
            },
          ].map(renderLink)}
        </ul>

        <Button
          navigate="/$/tags/edit"
          iconRight={ICONS.SETTINGS}
          className="navigation__link--title navigation__link"
          activeClass="navigation__link--active"
          label={__('Following')}
        />
        <ul className="tags--vertical navigation__links">
          {followedTags.map(({ name }, key) => (
            <li key={name}>
              <Tag navigate={`/$/tags?t${name}`} name={name} />
            </li>
          ))}
        </ul>
        <ul className="navigation__links--small">
          {subscriptions.map(({ uri, channelName }) => (
            <Button
              key={uri}
              navigate={uri}
              label={channelName}
              className="navigation__link"
              activeClass="navigation__link--active"
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SideBar;
