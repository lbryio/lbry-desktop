// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SocialShare from 'component/socialShare';
import Card from 'component/common/card';

type Props = {
  closeModal: () => void,
  uri: string,
  webShareable: boolean,
};

class ModalSocialShare extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, webShareable } = this.props;
    return (
      <Modal isOpen onAborted={closeModal} type="card">
        <Card title={__('Share')} actions={<SocialShare uri={uri} webShareable={webShareable} />} />
      </Modal>
    );
  }
}

export default ModalSocialShare;
