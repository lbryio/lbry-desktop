// @flow
import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { useOnResize } from 'effects/use-on-resize';

const COLLAPSED_HEIGHT = 120;

type Props = {
  children: React$Node | Array<React$Node>,
};

export default function Expandable(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const [rect, setRect] = useState();
  const { children } = props;
  const ref = useRef();

  // Update the rect initially & when the window size changes.
  useOnResize(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  });

  // Update the rect when children changes,
  // not sure if this is needed but a situation could arise when the
  // component re-renders with a different children prop,
  // Can enable on a later date if needed.
  // useLayoutEffect(() => {
  //   console.log('render, useLayoutEffect');
  //   if (ref.current) {
  //     setRect(ref.current.getBoundingClientRect());
  //   }
  // }, [children]);

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
          <Button
            button="link"
            className="expandable__button"
            label={expanded ? __('Less') : __('More')}
            onClick={handleClick}
          />
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
