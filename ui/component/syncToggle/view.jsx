// @flow
import * as MODALS from 'constants/modal_types';
import React from 'react';
import SettingsRow from 'component/settingsRow';
import { withRouter } from 'react-router';
import { FormField } from 'component/common/form';

type Props = {
  setSyncEnabled: (boolean) => void,
  syncEnabled: boolean,
  history: { push: (string) => void },
  location: UrlLocation,
  getSyncError: ?string,
  disabled: boolean,
  openModal: (string, any) => void,
};

function SyncToggle(props: Props) {
  // Redesign for new sync system
  const { openModal, syncEnabled, disabled } = props;

  return (
    <SettingsRow title={__('Sync')} subtitle={disabled ? '' : __('Sync your balance and preferences across devices.')}>
      <FormField
        type="checkbox"
        name="sync_toggle"
        label={disabled ? __('Sync your balance and preferences across devices.') : undefined}
        checked={syncEnabled}
        onChange={() => openModal(MODALS.SYNC_ENABLE, { mode: syncEnabled ? 'disable' : 'enable' })}
        disabled={disabled}
        helper={
          disabled
            ? __("To enable Sync, close LBRY completely and check 'Remember Password' during wallet unlock.")
            : null
        }
      />
    </SettingsRow>
  );
}

export default withRouter(SyncToggle);
