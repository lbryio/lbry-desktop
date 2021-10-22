// @flow
import { CLOUD_CONNECT_SITE_NAME } from 'config';
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import Card from 'component/common/card';

type Props = {
  closeModal: () => void,
  accessToken: string,
  user: any,
  doAuth: () => void,
  history: { push: (string) => void },
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

  const title = __('You Followed Your First Channel!');

  return (
    <Modal type="card" isOpen contentLabel={title}>
      <Card
        title={title}
        subtitle={
          <>
            {__('Awesome! You just followed your first channel.')}{' '}
            {user && user.primary_email
              ? __('You will receive notifications related to new content.')
              : __('Connect to %SITE_NAME% to receive notifications about new content.', { CLOUD_CONNECT_SITE_NAME })}
          </>
        }
        actions={
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
                  <Button
                    button="link"
                    onClick={() => {
                      closeModal();
                      history.push(`/$/${PAGES.AUTH}?redirect=${pathname}`);
                    }}
                    label={__('Log in')}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          </div>
        }
      />
    </Modal>
  );
};

export default ModalFirstSubscription;
