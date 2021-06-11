// @flow
import { SIMPLE_SITE } from 'config';
import * as PAGES from 'constants/pages';
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
        title={!SIMPLE_SITE ? __("You're free!") : __('Welcome to Odysee')}
        subtitle={
          !SIMPLE_SITE ? (
            <React.Fragment>
              <p>
                {__("You've escaped the land of spying, censorship, and exploitation.")}
                <span className="emoji"> 💩</span>
              </p>
              <p>
                {__('Welcome to the land of content freedom.')}
                <span className="emoji"> 🌈</span>
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                {__('You make the party extra special!')}
                <span className="emoji"> 💖</span>
              </p>
            </React.Fragment>
          )
        }
        actions={
          <div className="card__actions">
            <Button
              button="primary"
              label={__('Create an Account')}
              navigate={`/$/${PAGES.AUTH}`}
              onClick={doHideModal}
            />
            <Button button="link" label={__('Not Yet')} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
};

export default YoutubeWelcome;
