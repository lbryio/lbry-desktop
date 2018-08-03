import React from 'react';
import FilePrice from 'component/filePrice';
import { Modal } from 'modal/modal';

class ModalAffirmPurchase extends React.PureComponent {
  constructor() {
    super();

    this.onAffirmPurchase = this.onAffirmPurchase.bind(this);
  }

  onAffirmPurchase() {
    this.props.closeModal();
    this.props.loadVideo(this.props.uri);
  }

  render() {
    const {
      cancelPurchase,
      metadata: { title },
      uri,
    } = this.props;

    return (
      <Modal
        type="confirm"
        isOpen
        contentLabel={__('Confirm Purchase')}
        onConfirmed={this.onAffirmPurchase}
        onAborted={cancelPurchase}
      >
        {__('This will purchase')} <strong>{title}</strong> {__('for')}{' '}
        <strong>
          <FilePrice uri={uri} showFullPrice inheritStyle showLBC={false} />
        </strong>{' '}
        {__('credits')}.
      </Modal>
    );
  }
}

export default ModalAffirmPurchase;
