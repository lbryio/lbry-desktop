// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';

type Props = {
  closeModal: () => void,
  email: string,
  user: ?{ has_verified_email: boolean },
};

class ModalEmailCollection extends React.PureComponent<Props> {
  renderInner() {
    const { closeModal, email, user } = this.props;

    const cancelButton = <Button button="link" onClick={closeModal} label={__('Not Now')} />;

    if (user && !user.has_verified_email && !email) {
      return <UserEmailNew cancelButton={cancelButton} />;
    } else if (user && !user.has_verified_email) {
      return <UserEmailVerify onModal cancelButton={cancelButton} />;
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
