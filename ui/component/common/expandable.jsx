// @flow
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { useOnResize } from 'effects/use-on-resize';

const COLLAPSED_HEIGHT = 120;

type Props = {
  children: React$Node | Array<React$Node>,
};

export const ExpandableContext = React.createContext<any>();

export default function Expandable(props: Props) {
  const { children } = props;

  const ref = React.useRef();

  const [expanded, setExpanded] = React.useState(false);
  const [disabled, disableExpanded] = React.useState(false);
  const [childRect, setRect] = React.useState();

  const childOverflows = childRect && childRect.height > COLLAPSED_HEIGHT;

  function handleClick() {
    setExpanded(!expanded);
  }

  // Update the rect when children changes,
  // this is needed when there is an image or claim embed
  // to be loaded ! :D
  React.useLayoutEffect(() => {
    if (ref.current) {
      const childElem = ref.current.children[0];
      setRect(childElem.getBoundingClientRect());
    }
  }, [children]);

  const expandableRef = React.useCallback((node) => {
    if (node) {
      const childElem = node.children[0];
      setRect(childElem.getBoundingClientRect());
      ref.current = node;
    }
  }, []);

  // Update the childRect initially & when the window size changes.
  useOnResize(() => expandableRef(ref.current));

  return (
    <ExpandableContext.Provider value={{ setExpanded, disableExpanded }}>
      <div
        className={classnames('expandable', {
          'expandable--open': expanded,
          'expandable--closed-fade': !expanded && childOverflows,
        })}
        ref={expandableRef}
      >
        {children}
      </div>

      {childOverflows && !disabled && (
        <Button
          button="link"
          className="expandable__button"
          label={expanded ? __('Less') : __('More')}
          onClick={handleClick}
        />
      )}
    </ExpandableContext.Provider>
  );
}
