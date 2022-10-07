// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import JoinMembershipCard from 'component/joinMembershipCard';

type Props = {
  // -- redux --
  doHideModal: () => void,
};
class ModalJoinMembership extends React.PureComponent<Props> {
  render() {
    const { doHideModal } = this.props;

    return (
      <Modal onAborted={doHideModal} isOpen type="card">
        <JoinMembershipCard {...this.props} />
      </Modal>
    );
  }
}

export default ModalJoinMembership;
