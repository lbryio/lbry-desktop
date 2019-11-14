// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  onCommentAcknowledge: () => void,
  closeModal: () => void,
};

class ModalCommentAcknowledgement extends React.PureComponent<Props> {
  render() {
    const { closeModal, onCommentAcknowledge } = this.props;

    function onAbortedOrConfirmed() {
      onCommentAcknowledge();
      closeModal();
    }

    return (
      <Modal
        isOpen
        onAborted={onAbortedOrConfirmed}
        title={__('Comment Acknowledgement')}
        onConfirmed={onAbortedOrConfirmed}
      >
        <p>{__('A few things to know before making your comment:')}</p>
        <ul>
          <li>
            {__(
              'Commenting is in alpha. During the alpha, all comments are sent to a LBRY, Inc. server, not the LBRY network itself.'
            )}
          </li>
          <li>
            {__('Deleting or editing comments is not currently possible. Please be mindful of this when posting.')}
          </li>
          <li>{__('When the alpha ends, we will attempt to transition comments, but do not promise to do so.')}</li>
        </ul>
      </Modal>
    );
  }
}

export default ModalCommentAcknowledgement;
