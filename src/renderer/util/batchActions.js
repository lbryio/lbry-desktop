// https://github.com/reactjs/redux/issues/911
function batchActions(...actions) {
  return {
    type: "BATCH_ACTIONS",
    actions,
  };
}

export default batchActions;
