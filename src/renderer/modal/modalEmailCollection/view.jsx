import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link/index';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';

class ModalEmailCollection extends React.PureComponent {
  renderInner() {
    const { closeModal, email, user } = this.props;

    const cancelButton = <Link button="text" onClick={closeModal} label={__('Not Now')} />;

    if (!user.has_verified_email && !email) {
      return <UserEmailNew cancelButton={cancelButton} />;
    } else if (!user.has_verified_email) {
      return <UserEmailVerify cancelButton={cancelButton} />;
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
      <Modal type="custom" isOpen contentLabel="Email">
        <section>
          <h3 className="modal__header">Can We Stay In Touch?</h3>
          <div className="card__content">{this.renderInner()}</div>
          <div className="card__content">
            <div className="help">
              {`${__('Your email may be used to sync usage data across devices.')} `}
            </div>
          </div>
        </section>
      </Modal>
    );
  }
}

export default ModalEmailCollection;
