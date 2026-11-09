import { toHex } from '../../util/hex';

describe('toHex', () => {
  it('encodes plain ascii', () => {
    expect(toHex('abc')).toBe('616263');
    expect(toHex('LBRY')).toBe('4c425259');
  });

  it('returns an empty string for an empty input', () => {
    expect(toHex('')).toBe('');
  });

  it('encodes unicode as UTF-8 bytes', () => {
    expect(toHex('é')).toBe('c3a9');
    expect(toHex('₿')).toBe('e282bf');
  });

  it('zero-pads bytes below 0x10', () => {
    expect(toHex('\n')).toBe('0a');
  });
});
