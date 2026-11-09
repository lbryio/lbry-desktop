import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  toTrayWhenClosed: boolean,
  setToTrayWhenClosed: (arg1: boolean) => void,
  noLabels?: boolean
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
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: (e: any) => void; checked: boolean; label: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={toTrayWhenClosed}
        label={noLabels ? '' : __('Leave app running in notification area when the window is closed')}
      />
    </React.Fragment>
  );
}

export default SettingClosingBehavior;
