// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SocialShare from 'component/socialShare';

type Props = {
  closeModal: () => void,
  uri: string,
};

class ModalSocialShare extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri } = this.props;
    return (
      <Modal isOpen onAborted={closeModal} type="custom">
        <SocialShare uri={uri} onDone={closeModal} />
      </Modal>
    );
  }
}

export default ModalSocialShare;
