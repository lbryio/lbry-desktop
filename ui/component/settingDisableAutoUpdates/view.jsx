// @flow
import React from 'react';
import { FormField } from 'component/common/form';

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
          setClientSetting(newDisableAutoUpdates);
        }}
        checked={disableAutoUpdates}
      />
    </React.Fragment>
  );
}

export default SettingDisableAutoUpdates;
