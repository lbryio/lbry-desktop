import {
  shouldFetchTransactions,
  shouldGetReceiveAddress,
} from 'selectors/wallet'
import {
  shouldFetchFeaturedUris,
  shouldFetchDownloadedContent,
  shouldFetchPublishedContent,
} from 'selectors/content'
import {
  shouldFetchCurrentUriFileInfo,
} from 'selectors/file_info'
import {
  shouldFetchCurrentUriCostInfo,
} from 'selectors/cost_info'
import {
  shouldFetchCurrentUriAvailability,
} from 'selectors/availability'
import {
  doFetchTransactions,
  doGetNewAddress,
} from 'actions/wallet'
import {
  doFetchFeaturedUris,
  doFetchDownloadedContent,
  doFetchPublishedContent,
} from 'actions/content'
import {
  doFetchCurrentUriFileInfo,
} from 'actions/file_info'
import {
  doFetchCurrentUriCostInfo,
} from 'actions/cost_info'
import {
  doFetchCurrentUriAvailability,
} from 'actions/availability'

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
  selector: shouldFetchFeaturedUris,
  action: doFetchFeaturedUris,
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

triggers.push({
  selector: shouldFetchCurrentUriAvailability,
  action: doFetchCurrentUriAvailability,
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
