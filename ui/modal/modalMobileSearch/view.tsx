import React from "react";
import { Modal } from "modal/modal";
import WunderbarSuggestions from "component/wunderbarSuggestions";

type Props = {
  closeModal: () => void;
  channelsOnly?: boolean;
  noTopSuggestion?: boolean;
  noBottomLinks?: boolean;
  customSelectAction?: (arg1: string) => void;
};

export default function ModalMobileSearch(props: Props) {
  const { closeModal, channelsOnly, noTopSuggestion, noBottomLinks, customSelectAction } = props;

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; onAborted: () => void; isOpen: true; type: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
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
