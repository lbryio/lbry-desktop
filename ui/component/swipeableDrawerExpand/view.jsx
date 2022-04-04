// @flow
import 'scss/component/_swipeable-drawer.scss';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';

type Props = {
  label: any,
  // -- redux --
  onClick: () => void,
};

export default function DrawerExpandButton(buttonProps: Props) {
  return <Button className="swipeable-drawer__expand-button" button="primary" icon={ICONS.CHAT} {...buttonProps} />;
}
