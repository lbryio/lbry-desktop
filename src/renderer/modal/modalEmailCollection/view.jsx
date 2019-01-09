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
  getTitle() {
    const { user } = this.props;
    if (user && !user.has_verified_email) {
      return __('Awaiting Confirmation');
    }

    return __('Can We Stay In Touch?');
  }

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
      <Modal type="custom" isOpen contentLabel="Email" title={this.getTitle()}>
        <section className="card__content">{this.renderInner()}</section>
      </Modal>
    );
  }
}

export default ModalEmailCollection;
