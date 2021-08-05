// @flow
import * as MODALS from 'constants/modal_types';
import React from 'react';
import Button from 'component/button';
import { withRouter } from 'react-router';
import { FormField } from 'component/common/form';

type Props = {
  setSyncEnabled: (boolean) => void,
  syncEnabled: boolean,
  verifiedEmail: ?string,
  history: { push: (string) => void },
  location: UrlLocation,
  getSyncError: ?string,
  disabled: boolean,
  openModal: (string, any) => void,
};

function SyncToggle(props: Props) {
  const { verifiedEmail, openModal, syncEnabled, disabled } = props;

  return (
    <div>
      <FormField
        type="checkbox"
        name="sync_toggle"
        label={__('Sync your balance and preferences across devices.')}
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
          <Button requiresAuth button="primary" label={__('Add Email')} />
        </div>
      )}
    </div>
  );
}

export default withRouter(SyncToggle);
