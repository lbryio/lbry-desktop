// @flow
import React, { Fragment, useState, useRef, useContext, useLayoutEffect, createContext } from 'react';
import {
  Tabs as ReachTabs,
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanels as ReachTabPanels,
  TabPanel as ReachTabPanel,
} from '@reach/tabs';
import classnames from 'classnames';
import { useOnResize } from 'effects/use-on-resize';

// Tabs are a compound component
// The components are used individually, but they will still interact and share state
// When using, at a minimum you must arrange the components in this pattern
// When the <Tab> at index 0 is active, the TabPanel at index 0 will be displayed
//
// <Tabs onChange={...} index={...}>
//   <TabList>
//     <Tab>Tab label 1</Tab>
//     <Tab>Tab label 2</Tab>
//     ...
//   </TabList>
//   <TabPanels>
//     <TabPanel>Content for Tab 1</TabPanel>
//     <TabPanel>Content for Tab 2</TabPanel>
//     ...
//   </TabPanels>
// </Tabs>
//
// the base @reach/tabs components handle all the focus/accessibility labels
// We're just adding some styling

type TabsProps = {
  index?: number,
  onChange?: (number) => void,
  children: Array<React$Node>,
};

// Use context so child TabPanels can set the active tab, which is kept in Tabs' state
const AnimatedContext = createContext<any>();

function Tabs(props: TabsProps) {
  // Store the position of the selected Tab so we can animate the "active" bar to its position
  const [selectedRect, setSelectedRect] = useState(null);
  const [tabsRect, setTabsRect] = React.useState();

  // Create a ref of the parent element so we can measure the relative "left" for the bar for the child Tab's
  const tabsRef = useRef<Element | void | null>();

  // Recalculate "Rect" on window resize
  useOnResize(() => {
    if (tabsRef.current) {
      setTabsRect(tabsRef.current.getBoundingClientRect());
    }
  });

  const tabLabels = props.children[0];
  const tabContent = props.children[1];

  return (
    <AnimatedContext.Provider value={setSelectedRect}>
      <ReachTabs className="tabs" {...props} ref={tabsRef}>
        {tabLabels}

        <div
          className="tab__divider"
          style={{
            left: selectedRect && tabsRect && selectedRect.left - tabsRect.left,
            width: selectedRect && selectedRect.width,
          }}
        />

        {tabContent}
      </ReachTabs>
    </AnimatedContext.Provider>
  );
}

//
// The wrapper for the list of tab labels that users can click
type TabListProps = {
  className?: string,
};
function TabList(props: TabListProps) {
  const { className, ...rest } = props;
  return <ReachTabList className={classnames('tabs__list', className)} {...rest} />;
}

//
// The links that users click
// Accesses `setSelectedRect` from context to set itself as active if needed
// Flow doesn't understand we don't have to pass it in ourselves
type TabProps = {
  isSelected?: Boolean,
};
function Tab(props: TabProps) {
  // @reach/tabs provides an `isSelected` prop
  // We could also useContext to read it manually
  const { isSelected } = props;
  const [rect, setRect] = React.useState();

  // Recalculate "Rect" on window resize
  useOnResize(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  });

  // Each tab measures itself
  const ref = useRef<Element | void | null>();

  // and calls up to the parent when it becomes selected
  // we useLayoutEffect to avoid flicker
  const setSelectedRect = useContext(AnimatedContext);
  useLayoutEffect(() => {
    if (isSelected) setSelectedRect(rect);
  }, [isSelected, rect, setSelectedRect]);

  return <ReachTab ref={ref} {...props} className="tab" />;
}

//
// The wrapper for TabPanel
type TabPanelsProps = {
  header?: React$Node,
};
function TabPanels(props: TabPanelsProps) {
  const { header, ...rest } = props;
  return (
    <Fragment>
      {header}
      <ReachTabPanels {...rest} />
    </Fragment>
  );
}

//
// The wrapper for content when it's associated Tab is selected
function TabPanel(props: any) {
  return <ReachTabPanel className="tab__panel" {...props} />;
}

export { Tabs, TabList, Tab, TabPanels, TabPanel };
