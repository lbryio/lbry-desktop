// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ErrorText from 'component/common/error-text';
import Card from 'component/common/card';

type Props = {
  user: ?User,
  doToast: ({ message: string }) => void,
  doUserPasswordSet: (string, ?string) => void,
  doClearPasswordEntries: () => void,
  passwordSetPending: boolean,
  passwordSetSuccess: boolean,
  passwordSetError: ?string,
};

export default function SettingAccountPassword(props: Props) {
  const {
    user,
    doToast,
    doUserPasswordSet,
    //  passwordSetPending,
    passwordSetSuccess,
    passwordSetError,
    doClearPasswordEntries,
  } = props;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const hasPassword = user && user.password_set;

  function handleSubmit() {
    doUserPasswordSet(newPassword, oldPassword);
  }

  React.useEffect(() => {
    if (passwordSetSuccess) {
      setIsAddingPassword(false);
      doToast({
        message: __('Password updated successfully.'),
      });
      doClearPasswordEntries();
      setOldPassword('');
      setNewPassword('');
    }
  }, [passwordSetSuccess, setOldPassword, setNewPassword, doClearPasswordEntries, doToast]);

  return (
    <Card
      title={__('Account Password')}
      subtitle={hasPassword ? __('') : __('You do not currently have a password set.')}
      actions={
        isAddingPassword ? (
          <div>
            <Form onSubmit={handleSubmit} className="section">
              {hasPassword && (
                <FormField
                  type="password"
                  name="setting_set_old_password"
                  label={__('Old Password')}
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
              )}
              <FormField
                type="password"
                name="setting_set_new_password"
                label={__('New Password')}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />

              <div className="section__actions">
                <Button button="primary" type="submit" label={__('Set Password')} disabled={!newPassword} />
                {!hasPassword && (
                  <Button button="link" label={__('Cancel')} onClick={() => setIsAddingPassword(false)} />
                )}
              </div>
            </Form>
            {passwordSetError && (
              <div className="section">
                <ErrorText>{passwordSetError}</ErrorText>
              </div>
            )}
          </div>
        ) : (
          <Button
            button="primary"
            label={hasPassword ? __('Update Your Password') : __('Add A Password')}
            onClick={() => setIsAddingPassword(true)}
          />
        )
      }
    />
  );
}
