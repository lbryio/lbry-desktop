import React from "react";
import { Form, FormField } from "component/common/form";
import Button from "component/button";
import Card from "component/common/card";
import { setSavedPassword } from "util/saved-passwords";
import usePersistedState from "effects/use-persisted-state";
import I18nMessage from "component/i18nMessage";
import { useHistory } from "react-router";
import { SITE_HELP_EMAIL } from "config";

type Props = {
  getSync: (arg1: (arg1: any, arg2: boolean) => void, arg2?: string | null | undefined) => void;
  getSyncIsPending: boolean;
  email: string;
  passwordError: boolean;
  signOut: () => void;
  handleSyncComplete: (arg1: any, arg2: boolean) => void;
};

function SyncPassword(props: Props) {
  const { getSync, getSyncIsPending, email, signOut, passwordError, handleSyncComplete } = props;
  const {
    push,
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get("redirect");
  const [password, setPassword] = React.useState("");
  // @ts-expect-error - TS2554 - Expected 2 arguments, but got 1.
  const [rememberPassword, setRememberPassword] = usePersistedState(true);

  function handleSubmit() {
    getSync((error, hasDataChanged) => {
      handleSyncComplete(error, hasDataChanged);

      if (!error) {
        push(redirect || "/");
        setSavedPassword(password, rememberPassword);
      }
    }, password);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card
        title={__("Enter your wallet password")}
        subtitle={__(
          "You set your wallet password when you previously installed LBRY. This may have been on different device."
        )}
        actions={
          <div>
            {/* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ type: string; error: string; label: string; value: string; onChange: (e: any) => void; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
            <FormField
              type="password"
              error={passwordError && __("Wrong password for %email%", { email })}
              label={__("Password for %email%", { email })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              name="remember-password"
              type="checkbox"
              label={__("Remember My Password")}
              // @ts-expect-error - TS2322 - Type '{ name: string; type: string; label: string; checked: any; onChange: () => any; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            />
            <div className="card__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                type="submit"
                button="primary"
                label={getSyncIsPending ? __("Continue...") : __("Continue")}
                disabled={getSyncIsPending}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Cancel")} onClick={signOut} />
            </div>
            <p className="help">
              {/* @ts-expect-error - TS2745 (ts-migration) */}
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  // @ts-expect-error - TS2322 (ts-migration)
                  help: <Button button="link" label={__("help guide")} href="https://lbry.com/faq/account-sync" />,
                  // @ts-expect-error - TS2322 (ts-migration)
                  email: <Button button="link" href={`mailto:${SITE_HELP_EMAIL}`} label={`${SITE_HELP_EMAIL}`} />,
                }}
              >
                If you are having issues, checkout our %help% or email us at %email%.
              </I18nMessage>
            </p>
          </div>
        }
      />
    </Form>
  );
}

export default SyncPassword;
