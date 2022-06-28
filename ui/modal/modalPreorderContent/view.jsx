// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import PreorderContent from 'component/preorderContent';

type Props = {
  uri: string,
  doHideModal: () => void,
  checkIfAlreadyPurchased: () => void,
};

class ModalPreorderContent extends React.PureComponent<Props> {
  render() {
    const { uri, doHideModal, checkIfAlreadyPurchased } = this.props;

    return (
      <Modal onAborted={doHideModal} isOpen type="card">
        <PreorderContent uri={uri} onCancel={doHideModal} checkIfAlreadyPurchased={checkIfAlreadyPurchased} />
      </Modal>
    );
  }
}

export default ModalPreorderContent;
