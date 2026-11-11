import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import SettingsRow from 'component/settingsRow';
import { withRouter } from 'react-router';
import { FormField } from 'component/common/form';

type Props = {
  setSyncEnabled: (arg1: boolean) => void,
  syncEnabled: boolean,
  verifiedEmail: string | null | undefined,
  history: {
    push: (arg1: string) => void
  },
  location: UrlLocation,
  getSyncError: string | null | undefined,
  disabled: boolean,
  openModal: (arg1: string, arg2?: any) => void
};

function SyncToggle(props: Props) {
  const { verifiedEmail, openModal, syncEnabled, disabled } = props;

  return (
    <SettingsRow
      title={__('Sync')}
      subtitle={disabled || !verifiedEmail ? '' : __('Sync your balance and preferences across devices.')}
    >
      <FormField
        type="checkbox"
        name="sync_toggle"
        label={disabled || !verifiedEmail ? __('Sync your balance and preferences across devices.') : undefined}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; checked: string; onChange: () => void; disabled: boolean; helper: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={syncEnabled && verifiedEmail}
        onChange={() => openModal(MODALS.SYNC_ENABLE, { mode: syncEnabled ? 'disable' : 'enable' })}
        disabled={disabled || !verifiedEmail}
        helper={
          disabled
            ? __("To enable Sync, close LBRY completely and check 'Remember Password' during wallet unlock.")
            : null
        }
      />
      {!verifiedEmail && (
        <div>
          <p className="help">{__('An email address is required to sync your account.')}</p>
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            button="primary"
            label={__('Add Email')}
            navigate={`/$/${PAGES.AUTH}?redirect=${encodeURIComponent(props.location.pathname)}`}
          />
        </div>
      )}
    </SettingsRow>
  );
}

export default withRouter(SyncToggle);
