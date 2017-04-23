import {
  shouldFetchTransactions,
  shouldGetReceiveAddress,
} from 'selectors/wallet'
import {
  shouldFetchFeaturedContent,
} from 'selectors/content'
import {
  doFetchTransactions,
  doGetNewAddress,
} from 'actions/wallet'
import {
  doFetchFeaturedContent,
} from 'actions/content'

const triggers = []

triggers.push({
  selector: shouldFetchTransactions,
  action: doFetchTransactions,
})

triggers.push({
  selector: shouldGetReceiveAddress,
  action: doGetNewAddress
})

triggers.push({
  selector: shouldFetchFeaturedContent,
  action: doFetchFeaturedContent,
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
