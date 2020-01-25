// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';
import UriIndicator from 'component/uriIndicator';
import I18nMessage from 'component/i18nMessage';

type Props = {
  closeModal: () => void,
  uri: string,
  claimIsMine: boolean,
  isSupport: boolean,
};

class ModalSendTip extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, claimIsMine, isSupport } = this.props;

    return (
      <Modal
        onAborted={closeModal}
        isOpen
        type="custom"
        title={
          claimIsMine || isSupport ? (
            __('Add support to this claim')
          ) : (
            <I18nMessage
              tokens={{
                url: <UriIndicator uri={uri} inline />,
              }}
            >
              Send a tip to %url%
            </I18nMessage>
          )
        }
      >
        <SendTip
          uri={uri}
          claimIsMine={claimIsMine}
          isSupport={isSupport}
          onCancel={closeModal}
          sendTipCallback={closeModal}
        />
      </Modal>
    );
  }
}

export default ModalSendTip;
