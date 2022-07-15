
declare type ListInjectedItem = {
  node: Node | (index: number, lastVisibleIndex: ?number, pageSize: ?number) => Node,
  index?: number,
};
