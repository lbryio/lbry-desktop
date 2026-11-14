// https://github.com/reactjs/redux/issues/911
export function batchActions(...actions: unknown[]): { type: string; actions: unknown[] } {
  return {
    type: "BATCH_ACTIONS",
    actions,
  };
}
