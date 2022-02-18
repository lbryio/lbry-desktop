// @flow
import React from 'react';
import * as remote from '@electron/remote';
import { FormField } from 'component/common/form';

const { autoUpdater } = remote.require('electron-updater');

type Props = {
  setClientSetting: (boolean) => void,
  disableAutoUpdates: boolean,
};
function SettingDisableAutoUpdates(props: Props) {
  const { setClientSetting, disableAutoUpdates } = props;
  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="autoupdates"
        onChange={() => {
          const newDisableAutoUpdates = !disableAutoUpdates;
          autoUpdater.autoDownload = !newDisableAutoUpdates;
          setClientSetting(newDisableAutoUpdates);
        }}
        checked={disableAutoUpdates}
      />
    </React.Fragment>
  );
}

export default SettingDisableAutoUpdates;
