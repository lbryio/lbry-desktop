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
              ...buildLink(null, __('Home'), ICONS.HOME),
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
          ].map(renderLink)}
        </ul>

        <div className="navigation__link navigation__link--title">My LBRY</div>

        <div className="navigation__links">
          <ul>
            {[
              {
                ...buildLink(PAGES.DOWNLOADED, 'Downloads', ICONS.LOCAL),
              },
              {
                ...buildLink(PAGES.PUBLISHED, 'Publishes', ICONS.PUBLISHED),
              },
              {
                ...buildLink(PAGES.USER_HISTORY, 'History', ICONS.HISTORY),
              },
              {
                ...buildLink(PAGES.INVITE, 'Invite', ICONS.INVITE),
              },
              {
                ...buildLink(PAGES.REWARDS, 'Rewards', ICONS.FEATURED),
              },
            ].map(renderLink)}
          </ul>
        </div>
        <div className="navigation__link navigation__link--title">Wallet</div>

        <ul className="navigation__links">
          {[
            {
              ...buildLink(PAGES.WALLET, 'Overview', ICONS.WALLET),
            },
            {
              ...buildLink(PAGES.HISTORY, 'Transactions', ICONS.TRANSACTIONS),
            },
            {
              ...buildLink(PAGES.BACKUP, 'Backup', ICONS.BACKUP),
            },
          ].map(renderLink)}
        </ul>

        <ul className="navigation__links navigation__links--bottom">
          {[
            {
              ...buildLink(PAGES.SETTINGS, 'Settings', ICONS.SETTINGS),
            },
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
