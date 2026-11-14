import * as PAGES from "constants/pages";
import React from "react";
import { Lbryio } from "lbryinc";
import { useHistory } from "react-router";
import Card from "component/common/card";
import { Form, FormField } from "component/common/form";
import ErrorText from "component/common/error-text";
import Button from "component/button";
import Nag from "component/common/nag";
import Spinner from "component/spinner";

type Props = {
  user: User | null | undefined;
  doClearEmailEntry: () => void;
  doUserFetch: () => void;
  doToast: (arg1: { message: string }) => void;
  history: {
    push: (arg1: string) => void;
  };
  location: {
    search: string;
  };
  passwordSetPending: boolean;
  passwordSetError: string | null | undefined;
};

function UserPasswordReset(props: Props) {
  const { doClearEmailEntry, doToast, doUserFetch } = props;
  const { location, push } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const email = urlParams.get("email");
  const authToken = urlParams.get("auth_token");
  const verificationToken = urlParams.get("verification_token");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);

  function handleSubmit() {
    setLoading(true);

    // @ts-expect-error - TS2339 (ts-migration)
    Lbryio.call("user_email", "confirm", {
      email: email,
      verification_token: verificationToken,
    })
      .then(() =>
        // @ts-expect-error - TS2339 (ts-migration)
        Lbryio.call(
          "user_password",
          "set",
          {
            auth_token: authToken,
            new_password: password,
          },
          "post"
        )
      )
      .then(doUserFetch)
      .then(() => {
        setLoading(false);
        doToast({
          message: __("Password successfully changed!"),
        });
        push(`/`);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }

  function handleRestart() {
    doClearEmailEntry();
    push(`/$/${PAGES.AUTH_SIGNIN}`);
  }

  return (
    <section className="main__sign-in">
      <Card
        title={__("Choose a new password")}
        subtitle={__("Setting a new password for %email%", { email })}
        actions={
          <div>
            {/* @ts-expect-error - TS2769 - No overload matches this call. */}
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                type="password"
                name="password_set"
                label={__("New Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="section__actions">
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="primary"
                  type="submit"
                  label={loading ? __("Updating Password") : __("Update Password")}
                  disabled={!password || loading}
                />
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <Button button="link" label={__("Cancel")} onClick={handleRestart} />
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                {loading && <Spinner type="small" />}
              </div>
            </Form>
          </div>
        }
        nag={error && <Nag type="error" relative message={<ErrorText>{error}</ErrorText>} />}
      />
    </section>
  );
}

export default UserPasswordReset;
