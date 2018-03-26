// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SearchPage from 'page/search';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  closeModal: () => void,
  query: string,
};

class ModalSearch extends React.PureComponent<Props> {
  render() {
    const { closeModal, query } = this.props;
    return (
      <Modal isOpen type="custom" fullScreen>
        <Button noPadding button="alt" icon={icons.CLOSE} onClick={closeModal} />
        <SearchPage />
      </Modal>
    );
  }
}

export default ModalSearch;
