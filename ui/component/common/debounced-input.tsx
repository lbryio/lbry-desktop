import React, { useEffect, useState } from "react";
import { FormField } from "component/common/form";
import Icon from "component/common/icon";
import useDebounce from "effects/use-debounce";
import classnames from "classnames";

const FILTER_DEBOUNCE_MS = 300;

interface Props {
  defaultValue?: string;
  icon?: string;
  placeholder?: string;
  inline?: boolean;
  onChange: (newValue: string) => any;
}

export default function DebouncedInput(props: Props) {
  const { defaultValue = "", icon, placeholder = "", inline, onChange } = props;
  const [rawValue, setRawValue] = useState(defaultValue);
  const debouncedValue: string = useDebounce(rawValue, FILTER_DEBOUNCE_MS);

  useEffect(() => {
    onChange(debouncedValue);
  }, [onChange, debouncedValue]);

  return (
    <div className={classnames({ wunderbar: !inline, "wunderbar--inline": inline })}>
      {icon && <Icon icon={icon} />}
      <FormField
        // @ts-expect-error - TS2322 - Type '{ className: any; type: string; name: string; spellCheck: boolean; placeholder: string; value: string; onChange: (e: any) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
        className={classnames({ wunderbar__input: !inline, "wunderbar__input--inline": inline })}
        type="text"
        name="debounced_search"
        spellCheck={false}
        placeholder={placeholder}
        value={rawValue}
        onChange={(e) => setRawValue(e.target.value.trim())}
      />
    </div>
  );
}
