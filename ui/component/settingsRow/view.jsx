// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  title: string,
  subtitle?: string,
  multirow?: boolean, // Displays the Value widget(s) below the Label instead of on the right.
  useVerticalSeparator?: boolean, // Show a separator line between Label and Value. Useful when there are multiple Values.
  disabled?: boolean,
  highlighted?: boolean,
  children?: React$Node,
};

export default function SettingsRow(props: Props) {
  const { title, subtitle, multirow, useVerticalSeparator, disabled, highlighted, children } = props;
  return (
    <div
      className={classnames('card__main-actions settings__row', {
        'section__actions--between': !multirow,
        'opacity-30': disabled,
        'card--highlightedActive': highlighted,
      })}
    >
      <div className="settings__row--title">
        <p>{title}</p>
        {subtitle && <p className="settings__row--subtitle">{subtitle}</p>}
      </div>
      <div
        className={classnames('settings__row--value', {
          'settings__row--value--multirow': multirow,
          'settings__row--value--vertical-separator': useVerticalSeparator,
        })}
      >
        {children && children}
      </div>
    </div>
  );
}
