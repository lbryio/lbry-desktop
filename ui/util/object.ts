export function isEmpty(object: unknown): boolean {
  return (
    // @ts-expect-error - TS2322 - "in" needs a key on the left; kept as written so behaviour is unchanged
    object in [null, undefined] ||
    ((object as Record<string, unknown>).constructor === Object && Object.entries(object as object).length === 0)
  );
}
