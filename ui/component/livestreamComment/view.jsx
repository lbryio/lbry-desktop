// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuButton } from '@reach/menu-button';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import CommentMenuList from 'component/commentMenuList';
import UriIndicator from 'component/uriIndicator';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: StreamClaim,
  authorUri: string,
  commentId: string,
  message: string,
  commentIsMine: boolean,
  stakedLevel: number,
  supportAmount: number,
};

function Comment(props: Props) {
  const { claim, uri, authorUri, message, commentIsMine, commentId, stakedLevel, supportAmount } = props;
  const [mouseIsHovering, setMouseHover] = React.useState(false);
  const commentByOwnerOfContent = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;

  return (
    <li
      className={classnames('livestream-comment', {
        'livestream-comment--superchat': supportAmount > 0,
      })}
      onMouseOver={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
    >
      {supportAmount > 0 && (
        <div className="super-chat livestream-superchat__banner">
          <div className="livestream-superchat__banner-corner" />
          <CreditAmount amount={supportAmount} superChat className="livestream-superchat__amount" />
        </div>
      )}

      <div className="livestream-comment__body">
        {supportAmount > 0 && <ChannelThumbnail uri={authorUri} xsmall />}
        <div className="livestream-comment__info">
          <UriIndicator
            className={classnames('comment__author', {
              'comment__author--creator': commentByOwnerOfContent,
            })}
            link
            external
            uri={authorUri}
          />

          <div className="livestream-comment__text">
            <MarkdownPreview content={message} promptLinks stakedLevel={stakedLevel} />
          </div>
        </div>
      </div>

      <div className="livestream-comment__menu">
        <Menu>
          <MenuButton className="menu__button">
            <Icon
              size={18}
              className={mouseIsHovering ? 'comment__menu-icon--hovering' : 'comment__menu-icon'}
              icon={ICONS.MORE_VERTICAL}
            />
          </MenuButton>
          <CommentMenuList
            uri={uri}
            commentId={commentId}
            authorUri={authorUri}
            commentIsMine={commentIsMine}
            disableEdit
            disableRemove={supportAmount > 0}
          />
        </Menu>
      </div>
    </li>
  );
}

export default Comment;
