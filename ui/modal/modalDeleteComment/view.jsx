// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';

type Props = {
  deleteComment: () => void,
  closeModal: () => void,
};

class ModalDeleteComment extends React.PureComponent<Props> {
  render() {
    const { closeModal, deleteComment } = this.props;
    const doDeleteComment = () => {
      closeModal();
      deleteComment();
    };

    return (
      <Modal
        isOpen
        onAborted={closeModal}
        contentLabel={__('Confirm Comment Abandon')}
        type="card"
      >
        <Card
          title="Delete Comment"
          actions={
            <div className="card__actions">
              <Button
                button="primary"
                label={__('Delete')}
                onClick={doDeleteComment}
              />
              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>
          }
        />
      </Modal>
    );
  }
}

export default ModalDeleteComment;
