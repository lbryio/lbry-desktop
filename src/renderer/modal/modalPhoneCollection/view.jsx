// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import UserPhoneNew from 'component/userPhoneNew';
import UserPhoneVerify from 'component/userPhoneVerify';

type Props = {
  phone: ?number,
  user: {
    phone_number: ?number,
  },
  closeModal: () => void,
};

class ModalPhoneCollection extends React.PureComponent<Props> {
  renderInner() {
    const { closeModal, phone, user } = this.props;

    const cancelButton = <Button button="link" onClick={closeModal} label={__('Not Now')} />;

    if (!user.phone_number && !phone) {
      return <UserPhoneNew cancelButton={cancelButton} />;
    } else if (!user.phone_number) {
      return <UserPhoneVerify cancelButton={cancelButton} />;
    }
    return closeModal();
  }

  render() {
    const { user } = this.props;

    // this shouldn't happen
    if (!user) {
      return null;
    }

    return (
      <Modal type="custom" isOpen contentLabel="Phone" title={__('Verify Your Phone')}>
        <section className="card__content">{this.renderInner()}</section>
      </Modal>
    );
  }
}

export default ModalPhoneCollection;
