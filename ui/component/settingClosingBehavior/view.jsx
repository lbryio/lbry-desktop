// @flow

import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  toTrayWhenClosed: boolean,
  setToTrayWhenClosed: boolean => void,
};

function SettingClosingBehavior(props: Props) {
  const { toTrayWhenClosed, setToTrayWhenClosed } = props;

  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="totraywhenclosed"
        onChange={e => {
          setToTrayWhenClosed(e.target.checked);
        }}
        checked={toTrayWhenClosed}
        label={__('Leave app running in notification area when the window is closed')}
      />
    </React.Fragment>
  );
}

export default SettingClosingBehavior;
