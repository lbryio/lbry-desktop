// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SideNavigation from 'component/sideNavigation';

type Props = {
  doHideModal: () => void,
};

export default function ModalMobileNavigation(props: Props) {
  const { doHideModal } = props;

  return (
    <Modal type="card" isOpen contentLabel={__('Navigation')} onAborted={doHideModal}>
      <SideNavigation sticky={false} showAllLinks />
    </Modal>
  );
}
