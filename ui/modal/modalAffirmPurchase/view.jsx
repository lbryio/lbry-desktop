// @flow
import React from 'react';
import FilePrice from 'component/filePrice';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  loadVideo: string => void,
  uri: string,
  cancelPurchase: () => void,
  metadata: StreamMetadata,
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

    const modalTitle = __('Confirm Purchase');

    return (
      <Modal type="card" isOpen contentLabel={modalTitle} onAborted={cancelPurchase}>
        <Card
          title={modalTitle}
          subtitle={
            <I18nMessage
              tokens={{
                claim_title: <strong>{title ? `"${title}"` : uri}</strong>,
                amount: <FilePrice uri={uri} showFullPrice inheritStyle />,
              }}
            >
              This will purchase %claim_title% for %amount%.
            </I18nMessage>
          }
          actions={
            <div className="section__actions">
              <Button button="primary" label={__('Confirm')} onClick={this.onAffirmPurchase} />
              <Button button="link" label={__('Cancel')} onClick={cancelPurchase} />
            </div>
          }
        />
      </Modal>
    );
  }
}

export default ModalAffirmPurchase;
