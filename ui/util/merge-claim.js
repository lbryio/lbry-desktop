/*
new claim = { ...maybeResolvedClaim, ...pendingClaim, meta: maybeResolvedClaim['meta'] }
 */

export default function mergeClaims(maybeResolved, pending) {
  return { ...maybeResolved, ...pending, meta: maybeResolved.meta };
}
