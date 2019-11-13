// @flow

import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  autoLaunch: string,
  showToast: ({}) => void,
  setAutoLaunch: boolean => void,
};

function SettingAutoLaunch(props: Props) {
  const { autoLaunch, setAutoLaunch } = props;

  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="autolaunch"
        onChange={e => {
          setAutoLaunch(e.target.checked);
        }}
        checked={autoLaunch}
        label={__('Start minimized')}
        helper={__(
          'Improve view speed and help the LBRY network by allowing the app to cuddle up in your system tray.'
        )}
      />
    </React.Fragment>
  );
}

export default SettingAutoLaunch;
