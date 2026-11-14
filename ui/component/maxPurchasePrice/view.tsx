import React from "react";
import { FormField, FormFieldPrice } from "component/common/form";

type Price = {
  currency: string;
  amount: number;
};

type DaemonSettings = {
  download_dir: string;
  share_usage_data: boolean;
  max_key_fee?: Price;
  max_connections_per_download?: number;
  save_files: boolean;
  save_blobs: boolean;
  ffmpeg_path: string;
};

type SetDaemonSettingArg = boolean | string | number | Price;

type Props = {
  daemonSettings: DaemonSettings;
  setDaemonSetting: (arg1: string, arg2?: SetDaemonSettingArg | null | undefined) => void;
};

export default function MaxPurchasePrice(props: Props) {
  const { daemonSettings, setDaemonSetting } = props;

  const defaultMaxKeyFee = { currency: "USD", amount: 50 } as const;
  const disableMaxKeyFee = !(daemonSettings && daemonSettings.max_key_fee);

  function onKeyFeeDisableChange(isDisabled: boolean) {
    if (isDisabled) {
      setDaemonSetting("max_key_fee");
    }
  }

  function onKeyFeeChange(newValue: Price) {
    setDaemonSetting("max_key_fee", newValue);
  }

  return (
    <>
      <FormField
        type="radio"
        name="no_max_purchase_no_limit"
        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; label: string; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={disableMaxKeyFee}
        label={__("No Limit")}
        onChange={() => onKeyFeeDisableChange(true)}
      />
      <FormField
        type="radio"
        name="max_purchase_limit"
        // @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; onChange: () => void; label: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        checked={!disableMaxKeyFee}
        onChange={() => {
          onKeyFeeDisableChange(false);
          onKeyFeeChange(defaultMaxKeyFee);
        }}
        label={__("Choose limit")}
      />

      {/* @ts-expect-error - TS2739 - Type '{ name: string; min: number; onChange: (newValue: Price) => void; price: Price; disabled: boolean; }' is missing the following properties from type 'Readonly<Props>': placeholder, step */}
      <FormFieldPrice
        name="max_key_fee"
        min={0}
        onChange={onKeyFeeChange}
        price={daemonSettings.max_key_fee ? daemonSettings.max_key_fee : defaultMaxKeyFee}
        disabled={disableMaxKeyFee}
      />
    </>
  );
}
