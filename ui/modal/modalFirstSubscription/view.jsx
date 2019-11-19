// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import * as PAGES from 'constants/pages';

type Props = {
  closeModal: () => void,
  accessToken: string,
  user: any,
  doAuth: () => void,
  history: { push: string => void },
  location: UrlLocation,
};

const ModalFirstSubscription = (props: Props) => {
  const {
    closeModal,
    accessToken,
    user,
    history,
    location: { pathname },
  } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Subscriptions 101" title={__('Subscriptions 101')}>
      <div className="section__subtitle">
        <p>{__('Awesome! You just subscribed to your first channel.')}{' '}
          { user && user.primary_email ? (
            <React.Fragment>
              {__('You will receive notifications related to new content.')}
            </React.Fragment>
            ) : (
            <React.Fragment>
              { __('Sign in with lbry.tv to receive notifications about new content.')}
            </React.Fragment>
          )}
        </p>
      </div>
      <div className="section__actions">
        <Button button="primary" onClick={closeModal} label={__('Got it')} />
        <React.Fragment>
          {user && user.primary_email ? (
            <React.Fragment>
              <Button
                button="link"
                href={`https://lbry.com/list/edit/${accessToken}`}
                label={__('Update email preferences')}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button button="link" onClick={() => {
                closeModal()
                history.push(`/$/${PAGES.AUTH}?redirect=${pathname}`);
              }} label={__('Sign in')} />
            </React.Fragment>
          )}
        </React.Fragment>
      </div>
    </Modal>
  );
};

export default ModalFirstSubscription;
