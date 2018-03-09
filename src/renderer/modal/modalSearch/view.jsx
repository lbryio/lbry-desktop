// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SendTip from 'component/walletSendTip';
import SearchPage from 'page/search';
import Button from 'component/link'

type Props = {
  closeModal: () => void,
  navigate: (string) => void,
  query: string,
};

class ModalSearch extends React.PureComponent<Props> {
  render() {
    const { closeModal, navigate, query } = this.props;
    return (
      <Modal
        isOpen
        type="custom"
        fullScreen
      >
        <Button icon="X" alt onClick={closeModal} />
        <SearchPage />
      </Modal>
    );
  }
}

export default ModalSearch;
