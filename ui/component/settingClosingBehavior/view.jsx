// @flow

import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  toTrayWhenClosed: boolean,
  setToTrayWhenClosed: (boolean) => void,
  noLabels?: boolean,
};

function SettingClosingBehavior(props: Props) {
  const { toTrayWhenClosed, setToTrayWhenClosed, noLabels } = props;

  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="totraywhenclosed"
        onChange={(e) => {
          setToTrayWhenClosed(e.target.checked);
        }}
        checked={toTrayWhenClosed}
        label={noLabels ? '' : __('Leave app running in notification area when the window is closed')}
      />
    </React.Fragment>
  );
}

export default SettingClosingBehavior;
