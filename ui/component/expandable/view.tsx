import React, {useRef, useState} from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { useRect } from '@reach/rect';

const COLLAPSED_HEIGHT = 120;

type Props = {
  children: React.ReactNode | Array<React.ReactNode>
};

export default function Expandable(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const { children } = props;
  const ref = useRef();
  const rect = useRect(ref);

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
            // @ts-expect-error - TS2322 (ts-migration)
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
