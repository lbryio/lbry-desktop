// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import WunderbarSuggestions from 'component/wunderbarSuggestions';

type Props = {
  closeModal: () => void,
  channelsOnly?: boolean,
  noTopSuggestion?: boolean,
  noBottomLinks?: boolean,
  customSelectAction?: (string) => void,
};

export default function ModalMobileSearch(props: Props) {
  const { closeModal, channelsOnly, noTopSuggestion, noBottomLinks, customSelectAction } = props;

  return (
    <Modal onAborted={closeModal} isOpen type="card">
      <WunderbarSuggestions
        isMobile
        channelsOnly={channelsOnly}
        noTopSuggestion={noTopSuggestion}
        noBottomLinks={noBottomLinks}
        customSelectAction={customSelectAction}
      />
    </Modal>
  );
}
