// @flow

import React from 'react';
import { FormField } from 'component/common/form';

type SetDaemonSettingArg = boolean | string | number;

type DaemonSettings = {
  save_blobs: boolean,
};

type Props = {
  // --- select ---
  daemonSettings: DaemonSettings,
  // --- perform ---
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
};

function SettingDataHosting(props: Props) {
  const { daemonSettings, setDaemonSetting } = props;

  return (
    <>
      <FormField
        type="checkbox"
        name="save_blobs"
        onChange={() => setDaemonSetting('save_blobs', !daemonSettings.save_blobs)}
        checked={daemonSettings.save_blobs}
      />
    </>
  );
}

export default SettingDataHosting;
