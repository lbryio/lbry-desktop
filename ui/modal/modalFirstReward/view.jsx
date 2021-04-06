// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
};

class ModalFirstReward extends React.PureComponent<Props> {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal type="card" isOpen contentLabel={__('Your first reward')}>
        <Card
          title={__('Your first reward')}
          subtitle={__('You just earned your first reward!')}
          body={
            <React.Fragment>
              <p>{__("This reward will show in your Wallet in the top right momentarily (if it hasn't already).")}</p>
              <p>
                {__(
                  'These Credits are used to compensate creators, to publish your own content, and to have say in how the network works.'
                )}
              </p>
              <p>{__('No need to understand it all just yet! Try watching or publishing something next.')}</p>
            </React.Fragment>
          }
          actions={<Button button="primary" onClick={closeModal} label={__('You Got It Dude')} />}
        />
      </Modal>
    );
  }
}

export default ModalFirstReward;
