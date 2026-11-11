import React from "react";
import { FormField } from "component/common/form";

type Props = {
  autoLaunch: string;
  showToast: (arg1: Record<any, any>) => void;
  setAutoLaunch: (arg1: boolean) => void;
  noLabels?: boolean;
};

function SettingAutoLaunch(props: Props) {
  const { autoLaunch, setAutoLaunch, noLabels } = props;

  return (
    <React.Fragment>
      <FormField
        type="checkbox"
        name="autolaunch"
        onChange={(e) => {
          setAutoLaunch(e.target.checked);
        }}
        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; onChange: (e: any) => void; checked: string; label: string; helper: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={autoLaunch}
        label={noLabels ? "" : __("Start minimized")}
        helper={
          noLabels
            ? ""
            : __("Improve view speed and help the LBRY network by allowing the app to cuddle up in your system tray.")
        }
      />
    </React.Fragment>
  );
}

export default SettingAutoLaunch;
