// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: string => void,
  uri: string,
};

class ModalPublishUpdateSuccess extends React.PureComponent<Props> {
  render() {
    const { closeModal, clearPublish, navigate, uri } = this.props;

    return (
      <Modal
        isOpen
        title={__('Success')}
        contentLabel={__('Updates published')}
        onConfirmed={() => {
          clearPublish();
          navigate('/$/published');
          closeModal();
        }}
      >
        <section className="card__content">
          <p>{__('Your updates have been published to LBRY at the address')}</p>
          <blockquote>{uri}</blockquote>
          <p>
            {__(
              'The updates will take a few minutes to appear for other LBRY users. Until then your file will be listed as "pending" under your published files.'
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalPublishUpdateSuccess;
