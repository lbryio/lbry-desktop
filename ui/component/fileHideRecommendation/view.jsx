// @flow
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  uri: string,
  buttonType: ?string,
  showLabel: ?boolean,
  focusable: boolean,
  // --- redux ---
  doRemovePersonalRecommendation: (uri: string) => void,
};

export default function FileHideRecommendation(props: Props) {
  const { uri, buttonType, showLabel = false, focusable = true, doRemovePersonalRecommendation } = props;

  function handleClick(e) {
    doRemovePersonalRecommendation(uri);
    e.preventDefault();
  }

  const label = __('Not interested');

  return (
    <Button
      button={buttonType}
      className={buttonType ? undefined : 'button--file-action'}
      title={label}
      icon={ICONS.REMOVE}
      label={showLabel ? label : null}
      onClick={handleClick}
      aria-hidden={!focusable}
      tabIndex={focusable ? 0 : -1}
    />
  );
}
