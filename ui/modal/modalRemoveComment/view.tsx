import React from "react";
import { Modal } from "modal/modal";
import Button from "component/button";
import Card from "component/common/card";

type Props = {
  commentId: string; // sha256 digest identifying the comment,
  commentIsMine: boolean; // if this comment was signed by an owned channel,
  contentChannelPermanentUrl: any;
  closeModal: () => void;
  deleteComment: (arg1: string, arg2?: string | null | undefined) => void;
  supportAmount?: any;
  setQuickReply: (arg1?: any) => void;
};

function ModalRemoveComment(props: Props) {
  const {
    commentId,
    commentIsMine,
    contentChannelPermanentUrl,
    closeModal,
    deleteComment,
    supportAmount,
    setQuickReply,
  } = props;

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={__("Confirm Comment Deletion")} type="card" onAborted={closeModal}>
      <Card
        title={__("Remove Comment")}
        body={
          <React.Fragment>
            <p>{__("Are you sure you want to remove this comment?")}</p>
            {Boolean(supportAmount) && (
              <p className="help error__text">
                {__("This comment has a tip associated with it which cannot be reverted.")}
              </p>
            )}
          </React.Fragment>
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                label={__("Remove")}
                onClick={() => {
                  closeModal();
                  deleteComment(commentId, commentIsMine ? undefined : contentChannelPermanentUrl);
                  if (setQuickReply) setQuickReply(undefined);
                }}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Cancel")} onClick={closeModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveComment;
