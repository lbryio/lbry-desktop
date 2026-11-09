//@ts-nocheck
/*
new claim = { ...maybeResolvedClaim, ...pendingClaim, meta: maybeResolvedClaim['meta'] }
 */

export default function mergeClaims(maybeResolved: unknown, pending: unknown) {
  return { ...maybeResolved, ...pending, meta: maybeResolved.meta };
}
