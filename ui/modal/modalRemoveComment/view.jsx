// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  commentId: string, // sha256 digest identifying the comment
  commentIsMine: boolean, // if this comment was signed by an owned channel
  contentChannelPermanentUrl: any,
  closeModal: () => void,
  deleteComment: (string, ?string) => void,
  supportAmount?: any,
};

function ModalRemoveComment(props: Props) {
  const { commentId, commentIsMine, contentChannelPermanentUrl, closeModal, deleteComment, supportAmount } = props;

  return (
    <Modal isOpen contentLabel={__('Confirm Comment Deletion')} type="card" onAborted={closeModal}>
      <Card
        title={__('Remove Comment')}
        body={
          <React.Fragment>
            <p>{__('Are you sure you want to remove this comment?')}</p>
            {Boolean(supportAmount) && (
              <p className="help error__text"> {__('This comment has a tip associated with it which cannot be reverted.')}</p>
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
                  deleteComment(commentId, commentIsMine ? undefined : contentChannelPermanentUrl);
                  closeModal();
                }}
              />
              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveComment;
