// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import UserPhoneVerify from 'component/userPhoneVerify';
import UserPhoneNew from 'component/userPhoneNew';
import { Redirect } from 'react-router';

type Props = {
  phone: ?number,
  user: {
    is_identity_verified: boolean,
  },
  closeModal: () => void,
  history: { push: string => void },
};

class ModalPhoneCollection extends React.PureComponent<Props> {
  renderInner() {
    const { closeModal, phone, user } = this.props;

    const cancelButton = <Button button="link" onClick={closeModal} label={__('Not Now')} />;

    if (!user.is_identity_verified && !phone) {
      return <UserPhoneNew cancelButton={cancelButton} />;
    } else if (!user.is_identity_verified) {
      return <UserPhoneVerify cancelButton={cancelButton} />;
    }

    closeModal();
    return <Redirect to="/$/rewards" />;
  }

  render() {
    const { user, closeModal } = this.props;

    // this shouldn't happen
    if (!user) {
      return null;
    }

    return (
      <Modal type="card" isOpen contentLabel="Phone" onAborted={closeModal}>
        {this.renderInner()}
      </Modal>
    );
  }
}

export default ModalPhoneCollection;
