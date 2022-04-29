// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import { VIDEO_QUALITY_OPTIONS } from 'constants/player';
import { toCapitalCase } from 'util/string';

const OPTION_DISABLED = 'Disabled';

type Props = {
  defaultQuality: ?string,
  doSetDefaultVideoQuality: (value: ?string) => void,
};

export default function SettingDefaultQuality(props: Props) {
  const { defaultQuality, doSetDefaultVideoQuality } = props;

  const valueRef = React.useRef();
  const dropdownOptions = [OPTION_DISABLED, ...VIDEO_QUALITY_OPTIONS];

  function handleSetQuality(e) {
    const { value } = e.target;

    doSetDefaultVideoQuality(value === OPTION_DISABLED ? null : value);
    valueRef.current = value;
  }

  return (
    <FormField
      name="default_video_quality"
      type="select"
      onChange={handleSetQuality}
      value={defaultQuality || valueRef.current}
    >
      {dropdownOptions.map((option) => {
        return (
          <option key={String(option)} value={option}>
            {typeof option === 'number' ? `${option}p` : __(toCapitalCase(option))}
          </option>
        );
      })}
    </FormField>
  );
}
