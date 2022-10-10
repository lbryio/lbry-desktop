// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import PreorderAndPurchaseContentCard from 'component/preorderAndPurchaseContentCard';
import { isURIEqual } from 'util/lbryURI';

type Props = {
  uri: string,
  doHideModal: () => void,
  checkIfAlreadyPurchased: () => void,
  hasCardSaved: boolean,
  tags: any,
  humanReadableTime: ?string,
  playingUri: PlayingUri,
  doSetPlayingUri: (params: PlayingUri) => void,
};

class ModalPreorderContent extends React.PureComponent<Props> {
  componentDidMount() {
    const { uri, playingUri, doSetPlayingUri } = this.props;

    if (playingUri.uri && isURIEqual(uri, playingUri.uri) && !playingUri.collection.collectionId) {
      doSetPlayingUri({ ...playingUri, uri: null });
    }
  }

  render() {
    const { uri, doHideModal, hasCardSaved, tags, humanReadableTime } = this.props;

    return (
      <Modal onAborted={doHideModal} ariaHideApp={false} isOpen type="card" width="wide">
        <PreorderAndPurchaseContentCard
          uri={uri}
          hasCardSaved={hasCardSaved}
          tags={tags}
          humanReadableTime={humanReadableTime}
        />
      </Modal>
    );
  }
}

export default ModalPreorderContent;
