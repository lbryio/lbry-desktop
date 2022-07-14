// @flow
import React from 'react';
import * as SETTINGS from 'constants/settings';
import { FormField } from 'component/common/form';

type SetDaemonSettingArg = boolean | string | number;

type DarkModeTimes = {
  from: { hour: string, min: string, formattedTime: string },
  to: { hour: string, min: string, formattedTime: string },
};

type OptionTimes = {
  fromTo: string,
  time: string,
};

type Props = {
  currentTheme: string,
  themes: Array<string>,
  automaticDarkModeEnabled: boolean,
  darkModeTimes: DarkModeTimes,
  clock24h: boolean,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  setDarkTime: (string, {}) => void,
};

export default function ThemeSelector(props: Props) {
  const {
    currentTheme,
    themes,
    automaticDarkModeEnabled,
    darkModeTimes,
    clock24h,
    setClientSetting,
    setDarkTime,
  } = props;

  const startHours = ['18', '19', '20', '21'];
  const endHours = ['5', '6', '7', '8'];

  function onThemeChange(event: SyntheticInputEvent<*>) {
    const { value } = event.target;
    if (value === 'dark') {
      onAutomaticDarkModeChange(false);
    }
    setClientSetting(SETTINGS.THEME, value);
  }

  function onAutomaticDarkModeChange(value: boolean) {
    setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, value);
  }

  function onChangeTime(event: SyntheticInputEvent<*>, options: OptionTimes) {
    setDarkTime(event.target.value, options);
  }

  function formatHour(time: string, clock24h: boolean) {
    if (clock24h) {
      return `${time}:00`;
    }

    const now = new Date(0, 0, 0, Number(time));
    return now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit' });
  }

  return (
    <>
      <fieldset-section>
        <FormField
          name="theme_select"
          type="select"
          onChange={onThemeChange}
          value={currentTheme}
          disabled={automaticDarkModeEnabled}
        >
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme === 'light' ? __('Light') : __('Dark')}
            </option>
          ))}
        </FormField>
      </fieldset-section>

      <fieldset-section>
        <FormField
          type="checkbox"
          name="automatic_dark_mode"
          onChange={() => onAutomaticDarkModeChange(!automaticDarkModeEnabled)}
          checked={automaticDarkModeEnabled}
          label={__('Automatic dark mode')}
        />

        {automaticDarkModeEnabled && (
          <fieldset-group class="fieldset-group--smushed">
            <FormField
              type="select"
              name="automatic_dark_mode_range_start"
              onChange={(value) => onChangeTime(value, { fromTo: 'from', time: 'hour' })}
              value={darkModeTimes.from.hour}
              label={__('From --[initial time]--')}
            >
              {startHours.map((time) => (
                <option key={time} value={time}>
                  {formatHour(time, clock24h)}
                </option>
              ))}
            </FormField>

            <FormField
              type="select"
              name="automatic_dark_mode_range_end"
              label={__('To --[final time]--')}
              onChange={(value) => onChangeTime(value, { fromTo: 'to', time: 'hour' })}
              value={darkModeTimes.to.hour}
            >
              {endHours.map((time) => (
                <option key={time} value={time}>
                  {formatHour(time, clock24h)}
                </option>
              ))}
            </FormField>
          </fieldset-group>
        )}
      </fieldset-section>
    </>
  );
}
