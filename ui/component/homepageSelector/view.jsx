// @flow
import React from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
// $FlowFixMe
import homepages from 'homepages';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import LANGUAGES from 'constants/languages';
import classnames from 'classnames';

import { useHistory } from 'react-router';

type Props = {
  homepage: string,
  setHomepage: string => void,
};

function SelectHomepage(props: Props) {
  const { homepage, setHomepage } = props;
  const { push } = useHistory();

  function handleSetHomepage(k) {
    push('/');
    setHomepage(k);
  }

  return (
    <Menu>
      <MenuButton className="button button-toggle button--alt">
        <Icon icon={ICONS.WEB} />
        <span className="button__label">{`${homepage}`}</span>
      </MenuButton>
      <MenuList className="menu__list">
        {Object.keys(homepages).map(k => {
          return (
            <MenuItem
              className={classnames('comment__menu-option menu__link', { 'menu__link--active': homepage === k })}
              key={k}
              onSelect={() => handleSetHomepage(k)}
            >
              {`${LANGUAGES[k][1]}`}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export default SelectHomepage;
