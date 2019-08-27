// @flow
import React from 'react';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';

type Props = {
  user: ?User,
  email: ?string,
};

function UserSignUp(props: Props) {
  const { email, user } = props;
  const verifiedEmail = user && email && user.has_verified_email;

  function getTitle() {
    if (!email) {
      return __('Get Rockin');
    } else if (email && !verifiedEmail) {
      return __('We Sent You An Email');
    }
  }

  return (
    <section>
      <h1 className="card__title--large">{getTitle()}</h1>
      {!email && <UserEmailNew />}
      {email && !verifiedEmail && <UserEmailVerify />}
    </section>
  );
}

export default UserSignUp;
