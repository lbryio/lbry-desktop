// @flow
import React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';
import CommentCreate from 'component/commentCreate';
import LivestreamComment from 'component/livestreamComment';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import CreditAmount from 'component/common/credit-amount';
import ChannelThumbnail from 'component/channelThumbnail';
import Tooltip from 'component/common/tooltip';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  activeViewers: number,
  embed?: boolean,
  doCommentSocketConnect: (string, string) => void,
  doCommentSocketDisconnect: (string) => void,
  doCommentList: (string, string, number, number) => void,
  comments: Array<Comment>,
  fetchingComments: boolean,
  doSuperChatList: (string) => void,
  superChats: Array<Comment>,
  superChatsTotalAmount: number,
  myChannels: ?Array<ChannelClaim>,
};

const VIEW_MODE_CHAT = 'view_chat';
const VIEW_MODE_SUPER_CHAT = 'view_superchat';
const COMMENT_SCROLL_OFFSET = 100;
const COMMENT_SCROLL_TIMEOUT = 25;

export default function LivestreamComments(props: Props) {
  const {
    claim,
    uri,
    embed,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    comments,
    doCommentList,
    fetchingComments,
    doSuperChatList,
    superChats,
    superChatsTotalAmount,
    myChannels,
  } = props;
  const commentsRef = React.createRef();
  const [scrollBottom, setScrollBottom] = React.useState(true);
  const [viewMode, setViewMode] = React.useState(VIEW_MODE_CHAT);
  const [performedInitialScroll, setPerformedInitialScroll] = React.useState(false);
  const claimId = claim && claim.claim_id;
  const commentsLength = comments && comments.length;
  const commentsToDisplay = viewMode === VIEW_MODE_CHAT ? comments : superChats;

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  }

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri, '', 1, 75);
      doSuperChatList(uri);
      doCommentSocketConnect(uri, claimId);
    }

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId);
      }
    };
  }, [claimId, uri, doCommentList, doSuperChatList, doCommentSocketConnect, doCommentSocketDisconnect]);

  React.useEffect(() => {
    const discussionElement = document.querySelector('.livestream__comments');
    const commentElement = document.querySelector('.livestream-comment');

    function handleScroll() {
      if (discussionElement) {
        const negativeCommentHeight = commentElement && -1 * commentElement.offsetHeight;
        const isAtRecent = negativeCommentHeight && discussionElement.scrollTop >= negativeCommentHeight;

        setScrollBottom(isAtRecent);
      }
    }

    if (discussionElement) {
      discussionElement.addEventListener('scroll', handleScroll);

      if (commentsLength > 0) {
        // Only update comment scroll if the user hasn't scrolled up to view old comments
        // If they have, do nothing
        if (!performedInitialScroll) {
          setTimeout(
            () =>
              (discussionElement.scrollTop =
                discussionElement.scrollHeight - discussionElement.offsetHeight + COMMENT_SCROLL_OFFSET),
            COMMENT_SCROLL_TIMEOUT
          );
          setPerformedInitialScroll(true);
        }
      }

      return () => discussionElement.removeEventListener('scroll', handleScroll);
    }
  }, [commentsLength, performedInitialScroll, setPerformedInitialScroll, setScrollBottom]);

  if (!claim) {
    return null;
  }

  function scrollBack() {
    const element = document.querySelector('.livestream__comments');
    if (element) element.scrollTop = 0;
  }

  return (
    <div className="card livestream__discussion">
      <div className="card__header--between livestream-discussion__header">
        <div className="livestream-discussion__title">{__('Live discussion')}</div>
        {superChatsTotalAmount > 0 && (
          <div className="recommended-content__toggles">
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_CHAT,
              })}
              label={__('Chat')}
              onClick={() => setViewMode(VIEW_MODE_CHAT)}
            />

            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_SUPER_CHAT,
              })}
              label={
                <>
                  <CreditAmount amount={superChatsTotalAmount} size={8} /> {__('Tipped')}
                </>
              }
              onClick={() => setViewMode(VIEW_MODE_SUPER_CHAT)}
            />
          </div>
        )}
      </div>
      <>
        {fetchingComments && !comments && (
          <div className="main--empty">
            <Spinner />
          </div>
        )}
        <div ref={commentsRef} className="livestream__comments-wrapper">
          {viewMode === VIEW_MODE_CHAT && superChatsTotalAmount > 0 && (
            <div className="livestream-superchats__wrapper">
              <div className="livestream-superchats__inner">
                {superChats.map((superChat: Comment) => (
                  <Tooltip key={superChat.comment_id} label={superChat.comment}>
                    <div className="livestream-superchat">
                      <div className="livestream-superchat__thumbnail">
                        <ChannelThumbnail uri={superChat.channel_url} xsmall />
                      </div>

                      <div className="livestream-superchat__info">
                        <UriIndicator uri={superChat.channel_url} link />
                        <CreditAmount
                          size={10}
                          className="livestream-superchat__amount-large"
                          amount={superChat.support_amount}
                        />
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {!fetchingComments && comments.length > 0 ? (
            <div className="livestream__comments">
              {commentsToDisplay.map((comment) => (
                <LivestreamComment
                  key={comment.comment_id}
                  uri={uri}
                  authorUri={comment.channel_url}
                  commentId={comment.comment_id}
                  message={comment.comment}
                  supportAmount={comment.support_amount}
                  commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                />
              ))}
            </div>
          ) : (
            <div className="main--empty" style={{ flex: 1 }} />
          )}

          {!scrollBottom && (
            <Button
              button="alt"
              className="livestream__comments-scroll__down"
              label={__('Recent Comments')}
              onClick={() => scrollBack()}
            />
          )}

          <div className="livestream__comment-create">
            <CommentCreate livestream bottom embed={embed} uri={uri} />
          </div>
        </div>
      </>
    </div>
  );
}
