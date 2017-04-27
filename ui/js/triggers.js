import {
  shouldFetchTransactions,
  shouldGetReceiveAddress,
} from 'selectors/wallet'
import {
  shouldFetchFeaturedContent,
  shouldFetchDownloadedContent,
  shouldFetchPublishedContent,
  shouldFetchCurrentUriFileInfo,
  shouldFetchCurrentUriCostInfo,
} from 'selectors/content'
import {
  doFetchTransactions,
  doGetNewAddress,
} from 'actions/wallet'
import {
  doFetchFeaturedContent,
  doFetchDownloadedContent,
  doFetchPublishedContent,
  doFetchCurrentUriFileInfo,
  doFetchCurrentUriCostInfo,
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

triggers.push({
  selector: shouldFetchDownloadedContent,
  action: doFetchDownloadedContent,
})

triggers.push({
  selector: shouldFetchPublishedContent,
  action: doFetchPublishedContent,
})

triggers.push({
  selector: shouldFetchCurrentUriFileInfo,
  action: doFetchCurrentUriFileInfo,
})

triggers.push({
  selector: shouldFetchCurrentUriCostInfo,
  action: doFetchCurrentUriCostInfo,
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
