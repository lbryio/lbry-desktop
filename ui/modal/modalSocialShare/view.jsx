// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SocialShare from 'component/socialShare';

type Props = {
  closeModal: () => void,
  uri: string,
  webShareable: boolean,
  isChannel: boolean,
};

class ModalSocialShare extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, webShareable, isChannel } = this.props;
    return (
      <Modal isOpen onAborted={closeModal} type="custom" title={__('Share')}>
        <SocialShare uri={uri} onDone={closeModal} webShareable={webShareable} isChannel={isChannel} />
      </Modal>
    );
  }
}

export default ModalSocialShare;
