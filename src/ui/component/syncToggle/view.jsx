// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';

type Props = {
  setSyncEnabled: boolean => void,
  syncEnabled: boolean,
  verifiedEmail: ?string,
};

function SyncToggle(props: Props) {
  const { setSyncEnabled, syncEnabled, verifiedEmail } = props;

  function handleChange() {
    setSyncEnabled(!syncEnabled);
  }

  return (
    <div>
      {!verifiedEmail ? (
        <Button requiresAuth button="primary" label={__('Start Syncing')} />
      ) : (
        <FormField
          type="checkbox"
          name="sync_toggle"
          label={__('Sync your balance and preferences accross LBRY apps.')}
          checked={syncEnabled}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default SyncToggle;
