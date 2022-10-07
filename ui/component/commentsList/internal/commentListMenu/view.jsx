// @flow

import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';

import * as ICONS from 'constants/icons';

import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  // -- redux --
  claimId: ?string,
  channelId: ?string,
  channelName: ?string,
  claimIsMine: boolean,
  channelHasMembershipTiers: boolean,
  areCommentsMembersOnly?: boolean,
  creatorMembershipsFetched: boolean,
  doToggleMembersOnlyCommentsSettingForClaimId: (claimId: ClaimId) => Promise<any>,
  doMembershipList: ({ channel_name: string, channel_id: string }) => Promise<CreatorMemberships>,
  doToast: ({ message: string }) => void,
};

const CommentListMenu = (props: Props) => {
  const {
    // -- redux --
    claimId,
    channelId,
    channelName,
    claimIsMine,
    channelHasMembershipTiers,
    areCommentsMembersOnly,
    creatorMembershipsFetched,
    doToggleMembersOnlyCommentsSettingForClaimId,
    doMembershipList,
    doToast,
  } = props;

  function updateMembersOnlyComments() {
    if (claimId) {
      doToggleMembersOnlyCommentsSettingForClaimId(claimId).then(() =>
        doToast({
          message: __(
            areCommentsMembersOnly
              ? 'Members-only comments are now disabled.'
              : 'Members-only comments are now enabled.'
          ),
        })
      );
    }
  }

  React.useEffect(() => {
    if (!creatorMembershipsFetched && channelName && channelId) {
      doMembershipList({ channel_name: channelName, channel_id: channelId });
    }
  }, [channelId, channelName, creatorMembershipsFetched, doMembershipList]);

  if (channelHasMembershipTiers && claimIsMine) {
    return (
      <Menu>
        <MenuButton className="button button--alt menu__button">
          <Icon size={18} icon={ICONS.SETTINGS} />
        </MenuButton>

        <MenuList className="menu__list">
          <MenuItem className="comment__menu-option" onSelect={() => updateMembersOnlyComments()}>
            <span className="menu__link">
              <Icon aria-hidden icon={ICONS.MEMBERSHIP} />
              {__(areCommentsMembersOnly ? 'Disable members-only comments' : 'Enable members-only comments')}
            </span>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return null;
};

export default CommentListMenu;
