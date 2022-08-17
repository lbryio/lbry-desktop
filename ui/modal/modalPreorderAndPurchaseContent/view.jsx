// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import PreorderAndPurchaseContentCard from 'component/preorderAndPurchaseContentCard';

type Props = {
  uri: string,
  checkIfAlreadyPurchasedOrPreordered: () => void,
  doHideModal: () => void,
  checkIfAlreadyPurchased: () => void,
  claimId: string,
  doCheckIfPurchasedClaimId: (string) => void,
  hasCardSaved: boolean,
  tags: any,
  humanReadableTime: ?string,
};

class ModalPreorderContent extends React.PureComponent<Props> {
  render() {
    const {
      uri,
      doHideModal,
      doCheckIfPurchasedClaimId,
      claimId,
      hasCardSaved,
      tags,
      humanReadableTime,
    } = this.props;

    return (
      <Modal onAborted={doHideModal} ariaHideApp={false} isOpen type="card">
        <PreorderAndPurchaseContentCard
          uri={uri}
          onCancel={doHideModal}
          doCheckIfPurchasedClaimId={doCheckIfPurchasedClaimId}
          claimId={claimId}
          hasCardSaved={hasCardSaved}
          tags={tags}
          humanReadableTime={humanReadableTime}
        />
      </Modal>
    );
  }
}

export default ModalPreorderContent;
