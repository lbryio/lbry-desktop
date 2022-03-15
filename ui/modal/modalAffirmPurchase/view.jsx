// @flow
import React from 'react';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import { isURIEqual } from 'util/lbryURI';

// This number is tied to transitions in scss/purchase.scss
const ANIMATION_LENGTH = 2500;

type Props = {
  closeModal: () => void,
  loadVideo: (string, (GetResponse) => void) => void,
  uri: string,
  cancelPurchase: () => void,
  metadata: StreamMetadata,
  analyticsPurchaseEvent: (GetResponse) => void,
  playingUri: PlayingUri,
  setPlayingUri: (?string) => void,
};

function ModalAffirmPurchase(props: Props) {
  const {
    closeModal,
    loadVideo,
    metadata: { title },
    uri,
    analyticsPurchaseEvent,
    playingUri,
    setPlayingUri,
  } = props;
  const [success, setSuccess] = React.useState(false);
  const [purchasing, setPurchasing] = React.useState(false);
  const modalTitle = __('Confirm Purchase');

  function onAffirmPurchase() {
    setPurchasing(true);
    loadVideo(uri, (fileInfo) => {
      setPurchasing(false);
      setSuccess(true);
      analyticsPurchaseEvent(fileInfo);

      if (playingUri.uri !== uri) {
        setPlayingUri(uri);
      }
    });
  }

  function cancelPurchase() {
    if (playingUri.uri && isURIEqual(uri, playingUri.uri)) {
      setPlayingUri(null);
    }

    closeModal();
  }

  React.useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => {
        closeModal();
        setSuccess(false);
      }, ANIMATION_LENGTH);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [success, uri]);

  return (
    <Modal type="card" isOpen contentLabel={modalTitle} onAborted={cancelPurchase}>
      <Card
        title={modalTitle}
        subtitle={
          <div className={classnames('purchase-stuff', { 'purchase-stuff--purchased': success })}>
            <div>
              {success && (
                <div className="purchase-stuff__text--purchased">
                  {__('Purchased!')}
                  <div className="purchase_stuff__subtext--purchased">
                    {__('This content will now be in your Library.')}
                  </div>
                </div>
              )}
              {/* Keep this message rendered but hidden so the width doesn't change */}
              <I18nMessage
                tokens={{
                  claim_title: <strong>{title ? `"${title}"` : uri}</strong>,
                }}
              >
                Are you sure you want to purchase %claim_title%?
              </I18nMessage>
            </div>
            <div>
              <FilePrice uri={uri} showFullPrice type="modal" />
            </div>
          </div>
        }
        actions={
          <div className="section__actions" style={success ? { visibility: 'hidden' } : undefined}>
            <Button
              button="primary"
              disabled={purchasing}
              label={purchasing ? __('Purchasing...') : __('Purchase')}
              onClick={onAffirmPurchase}
            />
            <Button button="link" label={__('Cancel')} onClick={cancelPurchase} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalAffirmPurchase;
