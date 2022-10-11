// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Comment from 'component/comment';
import Card from 'component/common/card';

type Props = {
  commentId: string, // sha256 digest identifying the comment
  deleterClaim: Claim,
  deleterIsModOrAdmin?: boolean,
  creatorClaim?: Claim,
  supportAmount?: any,
  setQuickReply: (any) => void,
  // --- redux ---
  comment?: Comment,
  doHideModal: () => void,
  doCommentAbandon: (string, Claim, ?boolean, ?Claim) => void,
};

function ModalRemoveComment(props: Props) {
  const {
    commentId,
    deleterClaim,
    deleterIsModOrAdmin,
    creatorClaim,
    supportAmount,
    setQuickReply,
    comment,
    doHideModal,
    doCommentAbandon,
  } = props;

  function getCommentPreview(comment: ?Comment) {
    return comment ? (
      <div className="section comment-preview non-clickable">
        <Comment comment={comment} isTopLevel hideActions hideContextMenu forceDisplayDeadComment />
      </div>
    ) : null;
  }

  return (
    <Modal isOpen contentLabel={__('Confirm Comment Deletion')} type="card" onAborted={doHideModal}>
      <Card
        title={__('Remove Comment')}
        body={
          <React.Fragment>
            <p>{__('Are you sure you want to remove this comment?')}</p>
            {Boolean(supportAmount) && (
              <p className="help error__text">
                {__('This comment has a tip associated with it which cannot be reverted.')}
              </p>
            )}
            <div>{getCommentPreview(comment)}</div>
          </React.Fragment>
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                button="primary"
                label={__('Remove')}
                onClick={() => {
                  doHideModal();
                  doCommentAbandon(commentId, deleterClaim, deleterIsModOrAdmin, creatorClaim);
                  if (setQuickReply) {
                    setQuickReply(undefined);
                  }
                }}
              />
              <Button button="link" label={__('Cancel')} onClick={doHideModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveComment;
