// @flow
import React from 'react';

import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';

import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';

import Icon from 'component/common/icon';

type Props = {
  membership: CreatorMembership,
  index: number,
  hasSubscribers: ?boolean,
  addEditingId: () => void,
  removeMembership: () => void,
  // -- redux --
  doOpenModal: (modalId: string, {}) => void,
  doToast: (params: { message: string }) => void,
  doDeactivateMembershipForId: (membershipId: number) => Promise<Membership>,
  doMembershipList: (params: MembershipListParams) => Promise<CreatorMemberships>,
};

function MembershipTier(props: Props) {
  const {
    membership,
    index,
    hasSubscribers,
    addEditingId,
    removeMembership,
    // -- redux --
    doOpenModal,
    doToast,
    doDeactivateMembershipForId,
    doMembershipList,
  } = props;

  return (
    <>
      <div className="membership-tier__header">
        <span className="membership-tier__name">{membership.Membership.name}</span>

        <Menu>
          <MenuButton className="menu__button">
            <Icon size={18} icon={ICONS.SETTINGS} />
          </MenuButton>

          <MenuList className={'menu__list membership-tier' + String(index + 1)}>
            <MenuItem className="comment__menu-option" onSelect={addEditingId}>
              <div className="menu__link">
                <Icon size={16} icon={ICONS.EDIT} />
                {__('Edit Tier')}
              </div>
            </MenuItem>

            <MenuItem
              className="comment__menu-option"
              onSelect={() =>
                hasSubscribers
                  ? doToast({
                      message: __('This membership has active subscribers and cannot be deleted.'),
                      isError: true,
                    })
                  : doOpenModal(MODALS.CONFIRM, {
                      title: __('Confirm Membership Deletion'),
                      subtitle: __('Are you sure you want to delete yor "%membership_name%" membership?', {
                        membership_name: membership.Membership.name,
                      }),
                      busyMsg: __('Deleting your membership...'),
                      onConfirm: (closeModal, setIsBusy) => {
                        setIsBusy(true);
                        doDeactivateMembershipForId(membership.Membership.id)
                          .then(() => {
                            setIsBusy(false);
                            doToast({ message: __('Your membership was successfully deleted.') });
                            removeMembership();
                            closeModal();
                            doMembershipList({
                              channel_name: membership.Membership.channel_name,
                              channel_id: membership.Membership.channel_id,
                            });
                          })
                          .catch(() => setIsBusy(false));
                      },
                    })
              }
            >
              <div className="menu__link">
                <Icon size={16} icon={ICONS.DELETE} />
                {__('Delete Tier')}
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      <div className="membership-tier__infos">
        <label>{__('Pledge')}</label>
        <span>${(membership.NewPrices[0].creator_receives_amount / 100).toFixed(2)}</span>

        <label>{__("User's price with Platform and Service fee")}</label>
        <span>
          {membership.NewPrices[0].client_pays ? `$${(membership.NewPrices[0].client_pays / 100).toFixed(2)}` : '...'}
        </span>

        <label>{__('Description ')}</label>
        <span className="membership-tier__description">{membership.Membership.description}</span>

        <div className="membership-tier__perks">
          <div className="membership-tier__perks-content">
            <label>{__('Odysee Perks')}</label>
            <ul>
              {membership.Perks && membership.Perks.map((tierPerk, i) => <li key={i}>{__(tierPerk.description)}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default MembershipTier;
