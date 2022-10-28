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

import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import { CHANNEL_SECTIONS_QUERIES as CSQ } from 'constants/urlParams';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  id: string,
  title: string,
  uris: Array<string>,
  channelId: ClaimId,
  showAllItems?: boolean,
  // --- redux ---
  isChannelMine: boolean,
  doOpenModal: (id: string, ?{}) => void,
  doDeleteChannelSection: (channelId: string, sectionId: string) => void,
};

export default function Section(props: Props) {
  const { id, title, uris, channelId, showAllItems, isChannelMine, doOpenModal, doDeleteChannelSection } = props;

  const { push } = useHistory();
  const items = showAllItems ? uris : uris.slice(0, 10);

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
        {isChannelMine && (
          <>
            <ContextMenuItem label={'Edit'} icon={ICONS.EDIT} onSelect={handleSectionEdit} />
            <ContextMenuItem label={'Delete'} icon={ICONS.DELETE} onSelect={handleSectionDelete} />
          </>
        )}
      </MenuList>
    </Menu>
  );

  // **************************************************************************
  // **************************************************************************

  function handleSectionEdit() {
    doOpenModal(MODALS.FEATURED_CHANNELS_EDIT, { channelId, sectionId: id });
  }

  function handleSectionDelete() {
    doOpenModal(MODALS.CONFIRM, {
      title: title ? __('Delete "%list_name%"?', { list_name: title.slice(0, 50) }) : __('Delete featured channels?'),
      subtitle: __('This action is permanent and cannot be undone.'),
      labelOk: __('Delete'),
      onConfirm: (closeModal) => {
        doDeleteChannelSection(channelId, id);
        closeModal();
      },
    });
  }

  // **************************************************************************
  // **************************************************************************

  return (
    <div className="channel-section-card">
      <div className="channel-section-card__header">
        <div className="channel-section-card__title">{title}</div>
        <div className="channel-section-card__menu">{isChannelMine && <ContextMenu />}</div>
      </div>
      <div className="channel-section-card__content">
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
          {!showAllItems && (
            <Button
              className="channel-section-card__item-overflow"
              button="link"
              iconRight={ICONS.ARROW_RIGHT}
              label={__('See all')}
              title={__('View full details')}
              onClick={() => push(`/$/${PAGES.FEATURED_CHANNELS}?${CSQ.CLAIM_ID}=${channelId}&${CSQ.SECTION_ID}=${id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
