// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: string => void,
  uri: string,
  isEdit: boolean,
  filePath: ?string,
};

class ModalPublishSuccess extends React.PureComponent<Props> {
  render() {
    const { closeModal, clearPublish, navigate, uri, isEdit, filePath } = this.props;
    const contentLabel = isEdit ? 'Update published' : 'File published';
    const publishMessage = isEdit ? 'update is now' : 'file is now';

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
        <p className="section__subtitle">
          {__(`Your %publishMessage% pending on LBRY. It will take a few minutes to appear for other users.`, {
            publishMessage,
          })}
        </p>
        <div className="card--inline">
          <ClaimPreview type="small" uri={uri} />
        </div>
        <p className="help">
          {filePath && !IS_WEB && (
            <React.Fragment>
              {__(
                `Upload will continue in the background, please do not shut down immediately. Leaving the app running helps the network, thank you!`
              )}{' '}
              <Button button="link" href="https://lbry.com/faq/host-content" label={__('Learn More')} />
            </React.Fragment>
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalPublishSuccess;
