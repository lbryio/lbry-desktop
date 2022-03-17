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
  membersOnly?: boolean,
  children?: React$Node,
};

export default function SettingsRow(props: Props) {
  const { title, subtitle, multirow, useVerticalSeparator, disabled, highlighted, membersOnly, children } = props;
  return (
    <div
      className={classnames('card__main-actions settings-row', {
        'section__actions--between': !multirow,
        'opacity-30': disabled,
        'card--highlightedActive': highlighted,
      })}
    >
      <div className="settings-row__title">
        <span>
          {title}
          {membersOnly && <span className="settings-row__members-only">{'PREMIUM'}</span>}
        </span>
        {subtitle && <p className="settings-row__subtitle">{subtitle}</p>}
      </div>
      <div
        className={classnames('settings-row__value', {
          'settings-row__value--multirow': multirow,
          'settings-row__vertical-separator': useVerticalSeparator,
        })}
      >
        {children && children}
      </div>
    </div>
  );
}
