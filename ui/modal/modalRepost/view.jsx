// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import RepostCreate from 'component/repostCreate';

type Props = {
    closeModal: () => void,
    uri: string,
}

class ModalRepost extends React.PureComponent<Props> {
    render() {
        const { closeModal, uri } = this.props;

        return (
            <Modal onAborted={closeModal} isOpen type="card">
                <RepostCreate uri={uri} name={null} onCancel={closeModal} />
            </Modal>
        );
    }
}

export default ModalRepost;
