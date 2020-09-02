// @flow
import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { useRect } from '@reach/rect';
import * as ICONS from 'constants/icons';

const COLLAPSED_HEIGHT = 120;
const TYPE_LIST = 'list';

type Props = {
  children: React$Node | Array<React$Node>,
  type: ?string,
};

export default function Expandable(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const { children, type } = props;
  const ref = useRef();
  const rect = useRect(ref);

  const typeBasic = (
    <Button
      button="link"
      className="expandable__button"
      label={expanded ? __('Less') : __('More')}
      onClick={handleClick}
    />
  );

  const typeList = (
    <Button
      button="link"
      className="expandable__button-list"
      label={expanded ? __('Show Less') : __('Show More')}
      iconRight={expanded ? ICONS.UP : ICONS.DOWN}
      onClick={handleClick}
    />
  );

  function handleClick() {
    setExpanded(!expanded);
  }

  return (
    <div ref={ref}>
      {rect && rect.height > COLLAPSED_HEIGHT ? (
        <div ref={ref}>
          <div
            className={classnames({
              'expandable--open': expanded,
              'expandable--closed': !expanded,
            })}
          >
            {children}
          </div>
          {type === TYPE_LIST ? <>{typeList}</> : <>{typeBasic}</>}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
