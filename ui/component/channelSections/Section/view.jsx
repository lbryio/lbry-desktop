// @flow
import React from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

import './style.scss';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import ChannelTitle from 'component/channelTitle';
import Icon from 'component/common/icon';
import Spinner from 'component/spinner';

import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  collectionId: string,
  showAllItems?: boolean,
  // --- redux ---
  collection: Collection,
  isUnpublished: boolean,
  isCollectionMine: boolean,
  hasEdits: boolean,
  claimIsPending: boolean,
  doClearEditsForCollectionId: (id: string) => void,
  doOpenModal: (id: string, ?{}) => void,
};

export default function Section(props: Props) {
  const {
    collectionId,
    showAllItems,
    collection,
    isUnpublished,
    isCollectionMine,
    hasEdits,
    claimIsPending,
    doClearEditsForCollectionId,
    doOpenModal,
  } = props;

  const { push } = useHistory();
  const status = isUnpublished || hasEdits ? '*' : null;
  const items = showAllItems ? collection.items : collection.items.slice(0, 10);

  // **************************************************************************
  // **************************************************************************

  const ContextMenuItem = (props: { label: string, icon: string, onSelect: any }) => (
    <MenuItem className="menu__link" onSelect={props.onSelect}>
      <Icon aria-hidden icon={props.icon} />
      {__(props.label)}
    </MenuItem>
  );

  const ContextMenu = (props: {}) => (
    <Menu>
      <MenuButton className="menu__button">
        <Icon size={18} icon={ICONS.MORE_VERTICAL} />
      </MenuButton>

      <MenuList className="menu__list">
        {isCollectionMine && (
          <>
            <ContextMenuItem label={'Edit'} icon={ICONS.EDIT} onSelect={handleSectionEdit} />
            {hasEdits && <ContextMenuItem label={'Discard Changes'} icon={ICONS.REMOVE} onSelect={handleDiscard} />}
            <ContextMenuItem label={'Delete'} icon={ICONS.DELETE} onSelect={handleSectionDelete} />
          </>
        )}
      </MenuList>
    </Menu>
  );

  // **************************************************************************
  // **************************************************************************

  function handleSectionEdit() {
    doOpenModal(MODALS.FEATURED_CHANNELS_EDIT, { edit: { collectionId } });
  }

  function handleSectionDelete() {
    doOpenModal(MODALS.COLLECTION_DELETE, { collectionId, simplify: true });
  }

  function handleDiscard() {
    doOpenModal(MODALS.CONFIRM, {
      title: __('Discard Changes'),
      subtitle: __('Discard all changes? The action cannot be undone.'),
      onConfirm: (closeModal) => {
        doClearEditsForCollectionId(collectionId);
        closeModal();
      },
    });
  }

  // **************************************************************************
  // **************************************************************************

  return (
    <div className="channel-section-card">
      <div className="channel-section-card__header">
        <div className="channel-section-card__title">
          {collection.name}
          {status && <div className="channel-section-card__status">{status}</div>}
        </div>
        <div className="channel-section-card__menu">{isCollectionMine && <ContextMenu />}</div>
      </div>
      <div className="channel-section-card__content">
        {claimIsPending && (
          <div className="help card__title--help">
            <Spinner type="small" />
            {__('Your changes will be live in a few minutes')}
          </div>
        )}
        <div className="channel-section-card__item-row">
          <div
            className={classnames('channel-section-card__item-list', {
              'channel-section-card__item-list--full': showAllItems,
            })}
          >
            {items.map((uri) => (
              <div key={uri} className="channel-section-card__item" onClick={() => push(formatLbryUrlForWeb(uri))}>
                <ChannelThumbnail uri={uri} />
                <ChannelTitle uri={uri} />
              </div>
            ))}
          </div>
          <Button
            className="channel-section-card__item-overflow"
            button="link"
            iconRight={ICONS.ARROW_RIGHT}
            label={__('More')}
            title={__('View full details')}
            onClick={() => push(`/$/${PAGES.PLAYLIST}/${collectionId}`)}
          />
        </div>
      </div>
    </div>
  );
}
