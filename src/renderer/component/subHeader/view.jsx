import React from 'react';
import Link from 'component/link';
import classnames from 'classnames';
import * as NOTIFICATION_TYPES from 'constants/notification_types';

const SubHeader = props => {
  const { subLinks, currentPage, navigate, fullWidth, smallMargin, notifications } = props;

  const badges = Object.keys(notifications).reduce(
    (acc, cur) => (notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING ? acc : acc + 1),
    0
  );

  const links = [];

  for (const link of Object.keys(subLinks)) {
    links.push(
      <Link
        onClick={event => navigate(`/${link}`, event)}
        key={link}
        className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected'}
      >
        {subLinks[link] === 'Subscriptions' && badges
          ? `Subscriptions (${badges})`
          : subLinks[link]}
      </Link>
    );
  }

  return (
    <nav
      className={classnames('sub-header', {
        'sub-header--full-width': fullWidth,
        'sub-header--small-margin': smallMargin,
      })}
    >
      {links}
    </nav>
  );
};

export default SubHeader;
