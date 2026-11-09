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
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={enablePrereleases}
      />
    </React.Fragment>
  );
}

export default SettingEnablePrereleases;
