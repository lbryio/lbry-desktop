// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import ClaimPreview from 'component/claimPreview';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: string => void,
  uri: string,
  isEdit: boolean,
};

class ModalPublishSuccess extends React.PureComponent<Props> {
  render() {
    const { closeModal, clearPublish, navigate, uri, isEdit } = this.props;
    const contentLabel = isEdit ? 'Updates published' : 'File published';
    const publishMessage = isEdit ? 'updates have been' : 'file has been';
    const publishType = isEdit ? 'updates' : 'file';

    return (
      <Modal
        isOpen
        title={__('Success')}
        contentLabel={__(contentLabel)}
        onConfirmed={() => {
          clearPublish();
          navigate('/$/published');
          closeModal();
        }}
        confirmButtonLabel={__('View My Publishes')}
        abortButtonLabel={__('Close')}
        onAborted={() => {
          clearPublish();
          closeModal();
        }}
      >
        <p className="card__subtitle">{__(`Your %publishMessage% published to LBRY.`, { publishMessage })}</p>
        <div className="card--inline">
          <ClaimPreview uri={uri} />
        </div>
        <p className="help">
          {__(
            `The ${publishType} will take a few minutes to appear for other LBRY users. Until then it will be listed as "pending" under your published files.`
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalPublishSuccess;
