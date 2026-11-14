import React from "react";
import { Modal } from "modal/modal";
import SocialShare from "component/socialShare";
import Card from "component/common/card";

type Props = {
  closeModal: () => void;
  uri: string;
  webShareable: boolean;
  collectionId?: number;
};

class ModalSocialShare extends React.PureComponent<Props> {
  render() {
    const { closeModal, uri, webShareable, collectionId } = this.props;
    return (
      // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; onAborted: () => void; type: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      <Modal isOpen onAborted={closeModal} type="card">
        <Card
          title={__("Share")}
          // @ts-expect-error - TS2322 - Type 'Element' is not assignable to type 'string | Node'.
          actions={<SocialShare uri={uri} webShareable={webShareable} collectionId={collectionId} />}
        />
      </Modal>
    );
  }
}

export default ModalSocialShare;
