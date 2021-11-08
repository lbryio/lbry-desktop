// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  commentId: string, // sha256 digest identifying the comment
  deleterClaim: Claim,
  deleterIsModOrAdmin?: boolean,
  creatorClaim?: Claim,
  supportAmount?: any,
  setQuickReply: (any) => void,
  // --- redux ---
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
    doHideModal,
    doCommentAbandon,
  } = props;

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
