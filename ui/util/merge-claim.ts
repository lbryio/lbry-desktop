/*
new claim = { ...maybeResolvedClaim, ...pendingClaim, meta: maybeResolvedClaim['meta'] }
 */

export default function mergeClaims<A extends { meta?: unknown }, B extends object>(
  maybeResolved: A,
  pending: B
): A & B & { meta: A["meta"] } {
  return { ...maybeResolved, ...pending, meta: maybeResolved.meta };
}
