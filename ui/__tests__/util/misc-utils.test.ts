import { isEmpty } from '../../util/object';
import { swapKeyAndValue } from '../../util/swap-json';
import { batchActions } from '../../util/batch-actions';

describe('isEmpty', () => {
  it('is true for an empty plain object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('is false for objects with keys or non-plain objects', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(new Date())).toBe(false);
  });
});

describe('swapKeyAndValue', () => {
  it('inverts a dictionary', () => {
    expect(swapKeyAndValue({ a: '1', b: '2' })).toEqual({ '1': 'a', '2': 'b' });
  });

  it('returns an empty object unchanged', () => {
    expect(swapKeyAndValue({})).toEqual({});
  });
});

describe('batchActions', () => {
  it('wraps actions in a BATCH_ACTIONS envelope', () => {
    const a = { type: 'A' };
    const b = { type: 'B' };
    expect(batchActions(a, b)).toEqual({ type: 'BATCH_ACTIONS', actions: [a, b] });
    expect(batchActions()).toEqual({ type: 'BATCH_ACTIONS', actions: [] });
  });
});
