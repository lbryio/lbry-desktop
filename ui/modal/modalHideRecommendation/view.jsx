// @flow
import React from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { FormField } from 'component/common/form-components/form-field';
import { Modal } from 'modal/modal';

type Props = {
  uri: string,
  onConfirm: (hideChannel: boolean) => void,
  doHideModal: () => void,
};

export default function ModalHideRecommendation(props: Props) {
  const { uri, onConfirm, doHideModal } = props;
  const [hideChannel, setHideChannel] = React.useState(false);

  function handleOnClick() {
    if (onConfirm) {
      onConfirm(hideChannel);
    }
    doHideModal();
  }

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <Card
        title={__('Not interested')}
        body={<ClaimPreview uri={uri} hideMenu hideActions nonClickable type="inline" properties={false} />}
        actions={
          <>
            <div className="section__checkbox">
              <FormField
                type="checkbox"
                name="hide_channel"
                label={__("Also, don't recommend channel")}
                checked={hideChannel}
                onChange={() => setHideChannel(!hideChannel)}
              />
            </div>
            <div className="section__actions">
              <Button button="primary" label={__('Submit')} onClick={handleOnClick} />
              <Button button="link" label={__('Cancel')} onClick={doHideModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}
