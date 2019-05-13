// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import Tooltip from 'component/common/tooltip';

type Props = {
  unreadSubscriptionTotal: number,
  shouldShowInviteGuide: string,
};

class SideBar extends React.PureComponent<Props> {
  render() {
    const { unreadSubscriptionTotal, shouldShowInviteGuide } = this.props;
    const buildLink = (path, label, icon, guide) => ({
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
      guide,
    });

    const renderLink = (linkProps, index) => {
      const { guide } = linkProps;

      const inner = (
        <Button
          {...linkProps}
          className={classnames('navigation__link', {
            'navigation__link--guide': guide,
          })}
          activeClass="navigation__link--active"
        />
      );

      return (
        <li key={index}>
          {guide ? (
            <Tooltip key={guide} alwaysVisible direction="right" body={guide}>
              {inner}
            </Tooltip>
          ) : (
            inner
          )}
        </li>
      );
    };

    return (
      <nav className="navigation">
        <ul className="navigation__links">
          {[
            {
              ...buildLink(null, __('Discover'), ICONS.DISCOVER),
            },
            {
              ...buildLink(
                PAGES.SUBSCRIPTIONS,
                `${__('Subscriptions')} ${unreadSubscriptionTotal > 0 ? '(' + unreadSubscriptionTotal + ')' : ''}`,
                ICONS.SUBSCRIPTION
              ),
            },
            {
              ...buildLink(PAGES.PUBLISHED, __('Publishes'), ICONS.PUBLISHED),
            },
            {
              ...buildLink(PAGES.HISTORY, __('Library'), ICONS.DOWNLOAD),
            },
          ].map(renderLink)}
        </ul>
        <div className="navigation__link navigation__link--title">Account</div>

        <ul className="navigation__links">
          {[
            {
              ...buildLink(PAGES.ACCOUNT, __('Overview'), ICONS.ACCOUNT),
            },
            {
              ...buildLink(PAGES.INVITE, __('Invite'), ICONS.INVITE, shouldShowInviteGuide && __('Check this out!')),
            },
            {
              ...buildLink(PAGES.REWARDS, __('Rewards'), ICONS.FEATURED),
            },
            {
              ...buildLink(PAGES.SEND, __('Send & Recieve'), ICONS.SEND),
            },
            {
              ...buildLink(PAGES.TRANSACTIONS, __('Transactions'), ICONS.TRANSACTIONS),
            },
            {
              ...buildLink(PAGES.SETTINGS, __('Settings'), ICONS.SETTINGS),
            },
            // @if TARGET='app'
            {
              ...buildLink(PAGES.BACKUP, __('Backup'), ICONS.BACKUP),
            },
            // @endif
          ].map(renderLink)}
        </ul>

        <ul className="navigation__links navigation__links--bottom">
          {[
            {
              ...buildLink(PAGES.HELP, __('Help'), ICONS.HELP),
            },
          ].map(renderLink)}
        </ul>
      </nav>
    );
  }
}

export default SideBar;
