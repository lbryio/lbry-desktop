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
  resendVerificationEmail: string => void,
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
      title={__('Email')}
      subtitle={__(
        'This information is disclosed only to LBRY, Inc. and not to the LBRY network. It is only required to save account information and earn rewards.'
      )}
      actions={
        isVerified ? (
          <FormField
            type="text"
            className="form-field--copyable"
            readOnly
            label={
              <React.Fragment>
                {__('Your Email')}{' '}
                <Button
                  button="link"
                  label={__('Update mailing preferences')}
                  href={`http://lbry.io/list/edit/${accessToken}`}
                />
              </React.Fragment>
            }
            inputButton={<UserSignOutButton button="inverse" />}
            value={email || ''}
          />
        ) : (
          <Button button="primary" label={__('Add Email')} navigate={`/$/${PAGES.AUTH}`} />
        )
      }
    />
  );
}

export default UserEmail;
