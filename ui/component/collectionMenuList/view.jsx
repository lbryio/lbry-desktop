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
import { PUBLISH_PAGE, EDIT_PAGE, PAGE_VIEW_QUERY } from 'page/collection/view';

type Props = {
  inline?: boolean,
  doOpenModal: (string, {}) => void,
  collectionName?: string,
  collectionId: string,
  playNextUri: string,
  doToggleShuffleList: (params: { currentUri?: string, collectionId: string, hideToast?: boolean }) => void,
  isBuiltin: boolean,
  publishedNotEdited: boolean,
  collectionEmpty: boolean,
  isMyCollection: boolean,
};

function CollectionMenuList(props: Props) {
  const {
    inline = false,
    collectionId,
    collectionName,
    doOpenModal,
    playNextUri,
    doToggleShuffleList,
    isBuiltin,
    publishedNotEdited,
    collectionEmpty,
    isMyCollection,
  } = props;

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
            <MenuItem className="comment__menu-option" onSelect={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}`)}>
              <a className="menu__link" href={`/$/${PAGES.PLAYLIST}/${collectionId}`}>
                <Icon aria-hidden icon={ICONS.VIEW} />
                {__('Open')}
              </a>
            </MenuItem>
            {!collectionEmpty && (
              <MenuItem
                className="comment__menu-option"
                onSelect={() => {
                  doToggleShuffleList({ collectionId });
                  setDoShuffle(true);
                }}
              >
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.SHUFFLE} />
                  {__('Shuffle Play')}
                </div>
              </MenuItem>
            )}

            {!isBuiltin && isMyCollection && (
              <>
                {!collectionEmpty && (
                  <MenuItem
                    className="comment__menu-option"
                    onSelect={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}?${PAGE_VIEW_QUERY}=${PUBLISH_PAGE}`)}
                  >
                    <div className="menu__link">
                      <Icon aria-hidden iconColor={'red'} icon={ICONS.PUBLISH} />
                      {publishedNotEdited ? __('Update') : __('Publish')}
                    </div>
                  </MenuItem>
                )}
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`)}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.EDIT} />
                    {__('Edit')}
                  </div>
                </MenuItem>
                <MenuItem
                  className="comment__menu-option"
                  onSelect={() => doOpenModal(MODALS.COLLECTION_DELETE, { collectionId })}
                >
                  <div className="menu__link">
                    <Icon aria-hidden icon={ICONS.DELETE} />
                    {__('Delete')}
                  </div>
                </MenuItem>
              </>
            )}
          </>
        )}
      </MenuList>
    </Menu>
  );
}

export default CollectionMenuList;
