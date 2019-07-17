// @flow
import * as React from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';
import cookie from 'cookie';

type Props = {
  cancelButton: React.Node,
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

  if (!accessToken) fetchAccessToken();

  const buttonsProps = IS_WEB
    ? {
        onClick: () => {
          document.cookie = cookie.serialize('auth_token', '');
          window.location.reload();
        },
      }
    : { href: 'https://lbry.com/faq/how-to-change-email' };

  return (
    <section className="card card--section">
      {!email && <UserEmailNew />}
      {user && email && !isVerified && <UserEmailVerify />}
      {email && isVerified && (
        <React.Fragment>
          <div className="card__header">
            <h2 className="card__title">{__('Email')}</h2>
            <p className="card__subtitle">
              {email && isVerified && __('Your email has been successfully verified')}
              {!email && __('')}.
            </p>
          </div>

          {isVerified && (
            <FormField
              type="text"
              className="form-field--copyable"
              readOnly
              label={
                <React.Fragment>
                  {__('Your Email - ')}{' '}
                  <Button
                    button="link"
                    label={__('Update mailing preferences')}
                    href={`http://lbry.io/list/edit/${accessToken}`}
                  />
                </React.Fragment>
              }
              value={email}
              inputButton={<Button button="inverse" label={__('Change')} {...buttonsProps} />}
            />
          )}
          <p className="help">
            {`${__(
              'This information is disclosed only to LBRY, Inc. and not to the LBRY network. It is only required to save account information and earn rewards.'
            )} `}
          </p>
        </React.Fragment>
      )}
    </section>
  );
}

export default UserEmail;
