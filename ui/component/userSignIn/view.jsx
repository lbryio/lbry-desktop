// @flow
import React from 'react';
import { withRouter } from 'react-router';
import UserEmailReturning from 'component/userEmailReturning';
import UserSignInPassword from 'component/userSignInPassword';
import Spinner from 'component/spinner';

type Props = {
  user: ?User,
  history: { push: string => void, replace: string => void },
  location: { search: string },
  userFetchPending: boolean,
  doUserSignIn: string => void,
  emailToVerify: ?string,
  passwordExists: boolean,
};

function UserSignIn(props: Props) {
  const { user, location, history, doUserSignIn, userFetchPending, emailToVerify, passwordExists } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const [emailOnlyLogin, setEmailOnlyLogin] = React.useState(false);
  const hasVerifiedEmail = user && user.has_verified_email;
  const redirect = urlParams.get('redirect');
  const showLoading = userFetchPending;
  const showEmail = !passwordExists || emailOnlyLogin;
  const showPassword = !showEmail && emailToVerify && passwordExists;

  React.useEffect(() => {
    if (hasVerifiedEmail || (!showEmail && !showPassword && !showLoading)) {
      history.replace(redirect || '/');
    }
  }, [showEmail, showPassword, showLoading, hasVerifiedEmail]);

  React.useEffect(() => {
    if (emailToVerify && emailOnlyLogin) {
      doUserSignIn(emailToVerify);
    }
  }, [emailToVerify, emailOnlyLogin, doUserSignIn]);

  return (
    <section>
      {(showEmail || showPassword) && (
        <div>
          {showEmail && <UserEmailReturning />}
          {showPassword && <UserSignInPassword onHandleEmailOnly={() => setEmailOnlyLogin(true)} />}
        </div>
      )}
      {!showEmail && !showPassword && showLoading && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
    </section>
  );
}

export default withRouter(UserSignIn);
