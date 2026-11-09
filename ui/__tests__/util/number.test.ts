import { formatNumber, formatNumberWithCommas, isTrulyANumber } from '../../util/number';

beforeEach(() => {
  localStorage.setItem('language', 'en');
});

describe('formatNumberWithCommas', () => {
  it('defaults to 8 fraction digits', () => {
    expect(formatNumberWithCommas(1234.5)).toBe('1,234.50000000');
  });

  it('respects an explicit digit count', () => {
    expect(formatNumberWithCommas(1234.5, 2)).toBe('1,234.50');
    expect(formatNumberWithCommas(1000000, 0)).toBe('1,000,000');
  });
});

describe('formatNumber', () => {
  it('formats with grouping', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('limits fraction digits', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57');
  });

  it('supports compact notation', () => {
    expect(formatNumber(1200000, 1, true)).toBe('1.2M');
    expect(formatNumber(1500, 1, true)).toBe('1.5K');
  });
});

describe('isTrulyANumber', () => {
  it('accepts finite numbers and rejects NaN and non-numbers', () => {
    expect(isTrulyANumber(5)).toBe(true);
    expect(isTrulyANumber(0)).toBe(true);
    expect(isTrulyANumber(NaN)).toBe(false);
    expect(isTrulyANumber('5' as any)).toBe(false);
    expect(isTrulyANumber(undefined as any)).toBe(false);
  });
});
