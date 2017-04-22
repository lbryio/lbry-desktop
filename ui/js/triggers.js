import {
  shouldFetchTransactions,
  shouldGetReceiveAddress,
} from 'selectors/wallet'
import {
  doFetchTransactions,
  doGetNewAddress,
} from 'actions/wallet'

const triggers = []

triggers.push({
  selector: shouldFetchTransactions,
  action: doFetchTransactions,
})

triggers.push({
  selector: shouldGetReceiveAddress,
  action: doGetNewAddress
})

const runTriggers = function() {
  triggers.forEach(function(trigger) {
    const state = app.store.getState();
    const should = trigger.selector(state)
    if (trigger.selector(state)) app.store.dispatch(trigger.action())
  });
}

module.exports = {
  triggers: triggers,
  runTriggers: runTriggers
}
