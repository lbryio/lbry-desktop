// @flow
import React from 'react';
import FilePrice from 'component/filePrice';
import { Modal } from 'modal/modal';
import type { Metadata } from 'types/claim';

type Props = {
  closeModal: () => void,
  loadVideo: string => void,
  uri: string,
  cancelPurchase: () => void,
  metadata: Metadata,
};

class ModalAffirmPurchase extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).onAffirmPurchase = this.onAffirmPurchase.bind(this);
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
        title={__('Confirm Purchase')}
        contentLabel={__('Confirm Purchase')}
        onConfirmed={this.onAffirmPurchase}
        onAborted={cancelPurchase}
      >
        <section className="card__content">
          <p>
            {__('This will purchase')} <strong>{`"${title}"`}</strong> {__('for')}{' '}
            <strong>
              <FilePrice uri={uri} showFullPrice inheritStyle showLBC={false} />
            </strong>{' '}
            {__('credits')}.
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAffirmPurchase;
