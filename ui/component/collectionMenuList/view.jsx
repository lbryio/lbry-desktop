// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import classnames from 'classnames';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import * as PAGES from 'constants/pages';
import { useHistory } from 'react-router';

type Props = {
  inline?: boolean,
  doOpenModal: (string, {}) => void,
  collectionName?: string,
  collectionId: string,
};

function ClaimMenuList(props: Props) {
  const { inline = false, collectionId, collectionName, doOpenModal } = props;

  const { push } = useHistory();

  return (
    <Menu>
      <MenuButton
        className={classnames('menu__button', { 'claim__menu-button': !inline, 'claim__menu-button--inline': inline })}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Icon size={20} icon={ICONS.MORE_VERTICAL} />
      </MenuButton>
      <MenuList className="menu__list">
        {collectionId && collectionName && (
          <>
            <MenuItem className="comment__menu-option" onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}`)}>
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.VIEW} />
                {__('Edit List')}
              </div>
            </MenuItem>
            <MenuItem
              className="comment__menu-option"
              onSelect={() => doOpenModal(MODALS.COLLECTION_DELETE, { collectionId })}
            >
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.DELETE} />
                {__('Delete List')}
              </div>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}

export default ClaimMenuList;
