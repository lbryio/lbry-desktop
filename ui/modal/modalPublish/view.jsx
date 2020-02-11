// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import Card from 'component/common/card';

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

    function handleClose() {
      clearPublish();
      closeModal();
    }

    return (
      <Modal isOpen type="card" contentLabel={__(contentLabel)} onAborted={handleClose}>
        <Card
          title={__('Success')}
          subtitle={__(`Your %publishMessage% pending on LBRY. It will take a few minutes to appear for other users.`, {
            publishMessage,
          })}
          body={
            <React.Fragment>
              <div className="card--inline">
                <ClaimPreview type="small" uri={uri} />
              </div>
              {filePath && !IS_WEB && (
                <p className="help">
                  <React.Fragment>
                    {__(
                      `Upload will continue in the background, please do not shut down immediately. Leaving the app running helps the network, thank you!`
                    )}{' '}
                    <Button button="link" href="https://lbry.com/faq/host-content" label={__('Learn More')} />
                  </React.Fragment>
                </p>
              )}
            </React.Fragment>
          }
          actions={
            <React.Fragment>
              <Button
                button="primary"
                label={__('View My Publishes')}
                onClick={() => {
                  clearPublish();
                  navigate('/$/published');
                  closeModal();
                }}
              />
              <Button button="link" label={__('Close')} onClick={handleClose} />
            </React.Fragment>
          }
        />
      </Modal>
    );
  }
}

export default ModalPublishSuccess;
