// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MenuLink, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  icon: string,
  name: string,
  page: string,
  requiresAuth?: boolean,
};

export default function HeaderMenuLink(props: Props) {
  const { icon, name, page, requiresAuth } = props;

  const { push } = useHistory();

  if (requiresAuth) {
    return (
      <MenuItem className="menu__link" onSelect={() => push(`/$/${PAGES.AUTH}`)}>
        <Icon aria-hidden icon={icon} />
        {name}
      </MenuItem>
    );
  }

  return (
    <MenuLink className="menu__link" as={Link} to={`/$/${page}`}>
      <Icon aria-hidden icon={icon} />
      {name}
    </MenuLink>
  );
}
