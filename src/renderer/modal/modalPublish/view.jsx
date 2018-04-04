// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: string => void,
  uri: string,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, clearPublish, navigate, uri } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('File published')}
        onConfirmed={() => {
          clearPublish();
          navigate('/published');
          closeModal();
        }}
      >
        <p>{__('Your file has been published to LBRY at the address')}</p>
        <p className="card__success-msg">{uri}</p>
        <p>
          {__(
            'The file will take a few minutes to appear for other LBRY users. Until then it will be listed as "pending" under your published files.'
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalSendTip;
