
declare type ListInjectedItem = {
  node: Node | (index: number, lastVisibleIndex: ?number, pageSize: ?number) => Node,
  index?: number,
};

declare type Price = {
  amount: number,
  currency: string,
};

declare type Duration = {
  value: number,
  unit: string,
};
