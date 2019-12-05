// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Confetti from 'react-confetti';
import Button from 'component/button';

type Props = { doHideModal: () => void };

const YoutubeWelcome = (props: Props) => {
  const { doHideModal } = props;

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <Confetti recycle={false} style={{ position: 'fixed' }} numberOfPieces={100} />
      <Card
        title={__('Welcome To The Promise Land')}
        subtitle={__(
          'Looks like you are coming from YouTube, some funny pun or something that introduces them to LBRY.'
        )}
        actions={<Button button="primary" label={__('Get To The Goods')} onClick={doHideModal} />}
      />
    </Modal>
  );
};

export default YoutubeWelcome;
