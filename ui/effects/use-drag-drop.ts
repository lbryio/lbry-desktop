//@ts-nocheck
import React from "react";

const LISTENER = {
  ADD: "add",
  REMOVE: "remove",
} as const;

const DRAG_TYPES = {
  END: "dragend",
  START: "dragstart",
  ENTER: "dragenter",
  LEAVE: "dragleave",
} as const;

const DRAG_SCORE = {
  [DRAG_TYPES.ENTER]: 1,
  [DRAG_TYPES.LEAVE]: -1,
} as const;

const DRAG_STATE = {
  [DRAG_TYPES.END]: false,
  [DRAG_TYPES.START]: true,
} as const;

// Returns simple detection for global drag-drop
export default function useFetched() {
  const [drag, setDrag] = React.useState(false);
  const [dropData, setDropData] = React.useState<any>(null);

  React.useEffect(() => {
    let dragCount = 0;
    let draggingElement = false;

    // Handle file drop
    const handleDropEvent = (event: unknown) => {
      // Ignore non file types ( html elements / text )
      if (!draggingElement) {
        event.stopPropagation();
        event.preventDefault();
        // Get files
        const files = event.dataTransfer.files;
        // Check for files
        if (files.length > 0) {
          setDropData(event.dataTransfer);
        }
      }
      // Reset state ( hide drop zone )
      dragCount = 0;
      setDrag(false);
    };

    // Drag event for non files type ( html elements / text )
    const handleDragElementEvent = (event: unknown) => {
      draggingElement = DRAG_STATE[event.type];
    };

    // Drag events
    const handleDragEvent = (event: unknown) => {
      event.stopPropagation();
      event.preventDefault();
      // Prevent multiple drop areas
      dragCount += DRAG_SCORE[event.type];
      // Dragged file enters the drop area
      if (dragCount === 1 && !draggingElement && event.type === DRAG_TYPES.ENTER) {
        setDrag(true);
      }
      // Dragged file leaves the drop area
      if (dragCount === 0 && event.type === DRAG_TYPES.LEAVE) {
        setDrag(false);
      }
    };

    // Register / Unregister listeners
    const handleEventListeners = (event: unknown) => {
      const action = `${event}EventListener`;
      // Handle drop event
      document[action]("drop", handleDropEvent);
      // Handle drag events
      document[action](DRAG_TYPES.ENTER, handleDragEvent);
      document[action](DRAG_TYPES.LEAVE, handleDragEvent);
      // Handle non files drag events
      document[action](DRAG_TYPES.END, handleDragElementEvent);
      document[action](DRAG_TYPES.START, handleDragElementEvent);
    };
    // On component mounted:
    // Register event listeners
    handleEventListeners(LISTENER.ADD);

    // On component unmounted:
    return () => {
      // Unregister event listeners
      handleEventListeners(LISTENER.REMOVE);
    };
  }, []);

  return { drag, dropData };
}
