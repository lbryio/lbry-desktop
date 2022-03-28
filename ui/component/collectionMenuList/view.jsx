// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import classnames from 'classnames';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import * as PAGES from 'constants/pages';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';

type Props = {
  inline?: boolean,
  doOpenModal: (string, {}) => void,
  collectionName?: string,
  collectionId: string,
  playNextUri: string,
  doToggleShuffleList: (string) => void,
};

function CollectionMenuList(props: Props) {
  const { inline = false, collectionId, collectionName, doOpenModal, playNextUri, doToggleShuffleList } = props;
  const [doShuffle, setDoShuffle] = React.useState(false);

  const { push } = useHistory();

  React.useEffect(() => {
    if (playNextUri && doShuffle) {
      setDoShuffle(false);
      const navigateUrl = formatLbryUrlForWeb(playNextUri);
      push({
        pathname: navigateUrl,
        search: generateListSearchUrlParams(collectionId),
        state: { forceAutoplay: true },
      });
    }
  }, [collectionId, doShuffle, playNextUri, push]);

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
              <a className="menu__link" href={`/$/${PAGES.LIST}/${collectionId}`}>
                <Icon aria-hidden icon={ICONS.VIEW} />
                {__('View List')}
              </a>
            </MenuItem>
            <MenuItem
              className="comment__menu-option"
              onSelect={() => {
                doToggleShuffleList(collectionId);
                setDoShuffle(true);
              }}
            >
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.SHUFFLE} />
                {__('Shuffle Play')}
              </div>
            </MenuItem>
            <MenuItem
              className="comment__menu-option"
              onSelect={() => push(`/$/${PAGES.LIST}/${collectionId}?view=edit`)}
            >
              <div className="menu__link">
                <Icon aria-hidden icon={ICONS.PUBLISH} />
                {__('Publish List')}
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

export default CollectionMenuList;
