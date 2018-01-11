import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link/index';
import UserFieldNew from 'component/userFieldNew';
import UserFieldVerify from 'component/userFieldVerify';

class ModalPhoneCollection extends React.PureComponent {
  renderInner() {
    const { closeModal, email, user } = this.props;

    const cancelButton = <Link button="text" onClick={closeModal} label={__('Not Now')} />;

    if (!user.has_verified_email && !email) {
      return <UserFieldNew cancelButton={cancelButton} />;
    } else if (!user.has_verified_email) {
      return <UserFieldVerify cancelButton={cancelButton} />;
    }
    closeModal();
  }

  render() {
    const { user } = this.props;

    // this shouldn't happen
    if (!user) {
      return null;
    }

    return (
      <Modal type="custom" isOpen contentLabel="Phone">
        <section>
          <h3 className="modal__header">Verify Your Phone</h3>
          {this.renderInner()}
        </section>
      </Modal>
    );
  }
}

export default ModalPhoneCollection;
