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
        onChange={() => {
          setAutoLaunch(!autoLaunch);
        }}
        checked={autoLaunch}
        label={__('Autolaunch on login')}
        helper={__(
          'Autoplay video and audio files when navigating to a file, as well as the next related item when a file finishes playing.'
        )}
      />
    </React.Fragment>
  );
}

export default SettingAutoLaunch;
