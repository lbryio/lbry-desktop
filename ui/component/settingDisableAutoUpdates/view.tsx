import React from "react";
import { FormField } from "component/common/form";

type Props = {
  setClientSetting: (arg1: boolean) => void;
  disableAutoUpdates: boolean;
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
        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={disableAutoUpdates}
      />
    </React.Fragment>
  );
}

export default SettingDisableAutoUpdates;
