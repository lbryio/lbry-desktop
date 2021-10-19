// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { Modal } from 'modal/modal';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import Card from 'component/common/card';
import Nag from 'component/common/nag';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: (string) => void,
  uri: string,
  isEdit: boolean,
  filePath: ?string,
  lbryFirstError: ?string,
};

class ModalPublishSuccess extends React.PureComponent<Props> {
  componentDidMount() {
    const { clearPublish } = this.props;
    clearPublish();
  }
  render() {
    const { closeModal, clearPublish, navigate, uri, isEdit, filePath, lbryFirstError } = this.props;
    //   $FlowFixMe
    let contentLabel;
    if (isEdit) {
      contentLabel = __('Update published');
    } else {
      contentLabel = __('File published');
    }

    let publishMessage;
    if (isEdit) {
      publishMessage = __('Your update is now pending. It will take a few minutes to appear for other users.');
    } else {
      publishMessage = __('Your content will be live shortly.');
    }

    function handleClose() {
      closeModal();
    }

    return (
      <Modal isOpen type="card" contentLabel={__(contentLabel)} onAborted={handleClose}>
        <Card
          title={__('Success')}
          subtitle={publishMessage}
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
            <div className="section__actions">
              <Button
                button="primary"
                label={__('View My Uploads')}
                onClick={() => {
                  clearPublish();
                  navigate(`/$/${PAGES.UPLOADS}`);
                  closeModal();
                }}
              />
              <Button button="link" label={__('Close')} onClick={handleClose} />
            </div>
          }
          nag={
            lbryFirstError && (
              <Nag
                relative
                type="error"
                message={
                  <span>
                    {__('Your file was published to LBRY, but the YouTube upload failed.')}
                    <br />
                    {lbryFirstError}
                  </span>
                }
              />
            )
          }
        />
      </Modal>
    );
  }
}

export default ModalPublishSuccess;
