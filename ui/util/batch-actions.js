// https://github.com/reactjs/redux/issues/911
export function batchActions(...actions) {
  return {
    type: 'BATCH_ACTIONS',
    actions,
  };
}
