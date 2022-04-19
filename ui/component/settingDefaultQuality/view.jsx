// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import { VIDEO_QUALITY_OPTIONS } from 'constants/video';
import { toCapitalCase } from 'util/string';

type Props = {
  defaultQuality: ?string,
  doSetDefaultVideoQuality: (value: ?string) => void,
};

export default function SettingDefaultQuality(props: Props) {
  const { defaultQuality, doSetDefaultVideoQuality } = props;

  const [enabled, setEnabled] = React.useState<boolean>(Boolean(defaultQuality));

  const valueRef = React.useRef(VIDEO_QUALITY_OPTIONS[0]);

  function handleEnable() {
    if (enabled) {
      setEnabled(false);
      // From enabled to disabled -> clear the setting
      doSetDefaultVideoQuality(null);
    } else {
      setEnabled(true);
      // From to disabled to enabled -> set the current shown value
      doSetDefaultVideoQuality(valueRef.current);
    }
  }

  function handleSetQuality(e) {
    const { value } = e.target;
    doSetDefaultVideoQuality(value);
    valueRef.current = value;
  }

  return (
    <>
      <fieldset-section>
        <FormField
          name="default_video_quality"
          type="select"
          onChange={handleSetQuality}
          disabled={!enabled}
          value={defaultQuality}
        >
          {VIDEO_QUALITY_OPTIONS.map((quality) => {
            const qualityStr = typeof quality === 'number' ? quality + 'p' : toCapitalCase(quality);

            return (
              <option key={'quality' + qualityStr} value={quality}>
                {qualityStr}
              </option>
            );
          })}
        </FormField>
      </fieldset-section>

      <fieldset-section>
        <FormField
          type="checkbox"
          name="enable_default_quality"
          onChange={handleEnable}
          checked={enabled}
          label={__('Enable default quality setting')}
        />
      </fieldset-section>
    </>
  );
}
