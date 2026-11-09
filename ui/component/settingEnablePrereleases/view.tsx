import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  setClientSetting: (arg1: boolean) => void,
  enablePrereleases: boolean
};
function SettingEnablePrereleases(props: Props) {
  const { setClientSetting, enablePrereleases } = props;
  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="prereleases"
        onChange={() => {
          setClientSetting(!enablePrereleases);
        }}
        checked={enablePrereleases}
      />
    </React.Fragment>
  );
}

export default SettingEnablePrereleases;
