// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
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
  unreadSubscriptionTotal: number,
};

class SideBar extends React.PureComponent<Props> {
  render() {
    const { unreadSubscriptionTotal } = this.props;
    const buildLink = (path, label, icon) => ({
      navigate: path ? `$/${path}` : '/',
      label,
      icon,
    });

    const renderLink = (linkProps, index) => (
      <li key={index}>
        <Button
          {...linkProps}
          className="navigation__link"
          activeClass="navigation__link--active"
        />
      </li>
    );

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
                `${__('Subscriptions')} ${
                  unreadSubscriptionTotal > 0 ? '(' + unreadSubscriptionTotal + ')' : ''
                }`,
                ICONS.SUBSCRIPTION
              ),
            },
            {
              ...buildLink(PAGES.PUBLISHED, 'Publishes', ICONS.PUBLISHED),
            },
            {
              ...buildLink(PAGES.HISTORY, 'History', ICONS.HISTORY),
            },
          ].map(renderLink)}
        </ul>
        <div className="navigation__link navigation__link--title">Account</div>

        <ul className="navigation__links">
          {[
            {
              ...buildLink(PAGES.ACCOUNT, 'Overview', ICONS.ACCOUNT),
            },
            {
              ...buildLink(PAGES.INVITE, 'Invite', ICONS.INVITE),
            },
            {
              ...buildLink(PAGES.REWARDS, 'Rewards', ICONS.FEATURED),
            },
            {
              ...buildLink(PAGES.SEND, 'Send & Recieve', ICONS.SEND),
            },
            {
              ...buildLink(PAGES.TRANSACTIONS, 'Transactions', ICONS.TRANSACTIONS),
            },
            {
              ...buildLink(PAGES.SETTINGS, 'Settings', ICONS.SETTINGS),
            },
            // @if TARGET='app'
            {
              ...buildLink(PAGES.BACKUP, 'Backup', ICONS.BACKUP),
            },
            // @endif
          ].map(renderLink)}
        </ul>

        <ul className="navigation__links navigation__links--bottom">
          {[
            {
              ...buildLink(PAGES.HELP, 'Help', ICONS.HELP),
            },
          ].map(renderLink)}
        </ul>
      </nav>
    );
  }
}

export default SideBar;
