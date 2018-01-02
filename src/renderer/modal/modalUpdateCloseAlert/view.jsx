import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link';

class ModalUpdateCloseAlert extends React.PureComponent {
  render() {
    const { quit } = this.props;

    return (
      <Modal
        isOpen
        type="alert"
        confirmButtonLabel={__('Close Now')}
        onConfirmed={quit}
      >
        <h3 className="text-center">{__('LBRY Will Upgrade')}</h3>
        <p>{__('Please select yes to the upgrade prompt shown after the app closes.')}</p>
      </Modal>
    );
  }
}

export default ModalUpdateCloseAlert;
