// Defualt function used by reach-ui tooltip componment,
// slightly modify to register current direction:
// https://github.com/reach/reach-ui/blob/f0c8c5c467be46c202148ee69b1ba789b57d5e60/packages/tooltip/src/index.js#L478

// feels awkward when it's perfectly aligned w/ the trigger
const OFFSET = 8;

const positionDefault = (triggerRect, tooltipRect, currentDirection, setDirection) => {
  const styles = {
    left: `${triggerRect.left + window.pageXOffset}px`,
    top: `${triggerRect.top + triggerRect.height + window.pageYOffset}px`,
  };

  const collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    right: window.innerWidth < triggerRect.left + tooltipRect.width,
    bottom: window.innerHeight < triggerRect.bottom + tooltipRect.height + OFFSET,
    left: triggerRect.left - tooltipRect.width < 0,
  };

  const directionRight = collisions.right && !collisions.left;
  const directionUp = collisions.bottom && !collisions.top;

  const direction = directionUp ? 'top' : 'bottom';

  if (direction !== currentDirection) {
    setDirection(direction);
  }

  return {
    ...styles,
    left: directionRight
      ? `${triggerRect.right - tooltipRect.width + window.pageXOffset}px`
      : `${triggerRect.left + window.pageXOffset}px`,
    top: directionUp
      ? `${triggerRect.top - OFFSET - tooltipRect.height + window.pageYOffset}px`
      : `${triggerRect.top + OFFSET + triggerRect.height + window.pageYOffset}px`,
  };
};

export default positionDefault;
