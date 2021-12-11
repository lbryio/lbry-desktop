// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import RepostCreate from 'component/repostCreate';

type Props = {
  closeModal: () => void,
  uri: string,
  name: string,
  contentUri: string,
  setContentUri: () => void,
  repostUri: string,
  setRepostUri: () => void,
}

class ModalRepost extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, name, contentUri, setContentUri, repostUri, setRepostUri } = this.props;

    return (
      <Modal onAborted={closeModal} isOpen type="card">
        <RepostCreate uri={uri} name={name} onCancel={closeModal} contentUri={contentUri} setContentUri={setContentUri} repostUri={repostUri} setRepostUri={setRepostUri} />
      </Modal>
    );
  }
}

export default ModalRepost;
