// @flow
import * as PAGES from 'constants/pages';
import type { Node } from 'react';
import React, { useEffect } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import UserSignOutButton from 'component/userSignOutButton';
import Card from 'component/common/card';

type Props = {
  cancelButton: Node,
  email: string,
  resendVerificationEmail: (string) => void,
  checkEmailVerified: () => void,
  user: {
    has_verified_email: boolean,
  },
  fetchAccessToken: () => void,
  accessToken: string,
};

function UserEmail(props: Props) {
  const { email, user, accessToken, fetchAccessToken } = props;

  let isVerified = false;
  if (user) {
    isVerified = user.has_verified_email;
  }

  useEffect(() => {
    if (!accessToken) {
      fetchAccessToken();
    }
  }, [accessToken, fetchAccessToken]);

  return (
    <Card
      title={__('odysee.com Account')}
      subtitle={
        isVerified
          ? undefined
          : __(
              'Creating a odysee.com account will allow you to earn rewards, receive content and security updates, and optionally backup your data.'
            )
      }
      actions={
        isVerified ? (
          <FormField
            type="text"
            className="form-field--copyable"
            readOnly
            label={
              <React.Fragment>
                {__('Your email')}{' '}
                <Button
                  button="link"
                  label={__('Update mailing preferences')}
                  href={`http://lbry.io/list/edit/${accessToken}`}
                />
              </React.Fragment>
            }
            inputButton={<UserSignOutButton button="secondary" />}
            value={email || ''}
          />
        ) : (
          <Button button="primary" label={__('Log In')} navigate={`/$/${PAGES.AUTH}`} />
        )
      }
    />
  );
}

export default UserEmail;
