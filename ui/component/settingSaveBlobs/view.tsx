import React from "react";
import { FormField } from "component/common/form";

type SetDaemonSettingArg = boolean | string | number;

type DaemonSettings = {
  save_blobs: boolean;
};

type Props = {
  // --- select ---
  daemonSettings: DaemonSettings;
  // --- perform ---
  setDaemonSetting: (arg1: string, arg2?: SetDaemonSettingArg | null | undefined) => void;
};

function SettingDataHosting(props: Props) {
  const { daemonSettings, setDaemonSetting } = props;

  return (
    <>
      <FormField
        type="checkbox"
        name="save_blobs"
        onChange={() => setDaemonSetting("save_blobs", !daemonSettings.save_blobs)}
        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: () => void; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={daemonSettings.save_blobs}
      />
    </>
  );
}

export default SettingDataHosting;
