import React from 'react';
import Link from 'component/link';
import classnames from 'classnames';

const SubHeader = props => {
  const { subLinks, currentPage, navigate, fullWidth, smallMargin } = props;

  const links = [];

  for (const link of Object.keys(subLinks)) {
    links.push(
      <Link
        onClick={event => navigate(`/${link}`, event)}
        key={link}
        className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected'}
      >
        {subLinks[link]}
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
