import {SITE_NAME} from 'config';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import Nag from 'component/common/nag';
import UserPasswordReset from 'component/userPasswordReset';

type Props = {
  errorMessage: string | null | undefined,
  emailToVerify: string | null | undefined,
  doClearEmailEntry: () => void,
  doUserSignIn: (arg1: string, arg2?: string | null | undefined) => void,
  onHandleEmailOnly: () => void,
  isPending: boolean
};

export default function UserSignInPassword(props: Props) {
  const { errorMessage, doUserSignIn, emailToVerify, onHandleEmailOnly, isPending } = props;
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = React.useState(false);

  function handleSubmit() {
    if (emailToVerify) {
      doUserSignIn(emailToVerify, password);
    }
  }

  function handleChangeToSignIn() {
    onHandleEmailOnly();
  }

  return (
    <div className="main__sign-in">
      {forgotPassword ? (
        // @ts-expect-error - TS2739 (ts-migration)
        <UserPasswordReset />
      ) : (
        <Card
          title={__('Enter your %SITE_NAME% password', { SITE_NAME })}
          subtitle={__('Logging in as %email%', { email: emailToVerify })}
          actions={
// @ts-expect-error - TS2769 - No overload matches this call.
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                type="password"
                name="sign_in_password"
// @ts-expect-error - TS2322 - Type '{ autoFocus: true; type: string; name: string; id: string; autoComplete: string; label: string; value: string; onChange: (e: any) => void; helper: Element; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                id="password"
                autoComplete="on"
                label={__('Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // @ts-expect-error - TS2322 (ts-migration)
                helper={<Button button="link" label={__('Forgot Password?')} onClick={() => setForgotPassword(true)} />}
              />

              <div className="section__actions">
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <Button button="primary" type="submit" label={__('Continue')} disabled={!password || isPending} />
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <Button button="link" onClick={handleChangeToSignIn} label={__('Use Magic Link')} />
              </div>
            </Form>
          }
          nag={errorMessage && <Nag type="error" relative message={errorMessage} />}
        />
      )}
    </div>
  );
}
