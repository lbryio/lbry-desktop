// @flow
import React, { Suspense } from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import UserPhoneVerify from 'component/userPhoneVerify';
import { Redirect } from 'react-router';

const LazyUserPhoneNew = React.lazy(() =>
  import(
    /* webpackChunkName: "userPhoneNew" */
    'component/userPhoneNew'
  )
);

type Props = {
  phone: ?number,
  user: {
    is_identity_verified: boolean,
  },
  closeModal: () => void,
  history: { push: string => void },
};

class ModalPhoneCollection extends React.PureComponent<Props> {
  getTitle() {
    const { user, phone } = this.props;

    if (!user.is_identity_verified && !phone) {
      return __('Enter Your Phone Number');
    }

    return __('Enter The Verification Code');
  }

  renderInner() {
    const { closeModal, phone, user } = this.props;

    const cancelButton = <Button button="link" onClick={closeModal} label={__('Not Now')} />;

    if (!user.is_identity_verified && !phone) {
      return (
        <Suspense fallback={<div />}>
          <LazyUserPhoneNew cancelButton={cancelButton} />
        </Suspense>
      );
    } else if (!user.is_identity_verified) {
      return <UserPhoneVerify cancelButton={cancelButton} />;
    }

    closeModal();
    return <Redirect to="/$/rewards" />;
  }

  render() {
    const { user } = this.props;

    // this shouldn't happen
    if (!user) {
      return null;
    }

    return (
      <Modal type="custom" isOpen contentLabel="Phone" title={this.getTitle()}>
        {this.renderInner()}
      </Modal>
    );
  }
}

export default ModalPhoneCollection;
