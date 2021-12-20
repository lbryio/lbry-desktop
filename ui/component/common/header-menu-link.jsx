// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuLink } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  icon: string,
  name: string,
  page: string,
};

export default function HeaderMenuLink(props: Props) {
  const { icon, name, page } = props;

  return (
    <MenuLink className="menu__link" as={Link} to={`/$/${page}`}>
      <Icon aria-hidden icon={icon} />
      {name}
    </MenuLink>
  );
}
