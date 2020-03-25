// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  children: React$Node | Array<React$Node>,
  title: string,
};

export default function ExpandingContainer(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const { children, title } = props;

  function handleClick() {
    setExpanded(!expanded);
  }

  return (
    <div className={'expanding-details'}>
      <div className={'expanding-details__header'}>
        <Button
          button="alt"
          className="expandable__button"
          label={title}
          icon={expanded ? ICONS.UP : ICONS.DOWN}
          onClick={handleClick}
        />
      </div>
      {expanded && <div className={'expanding-details__body'}>{children}</div>}
    </div>
  );
}
