import { toCapitalCase, toCompactNotation } from '../../util/string';

describe('toCapitalCase', () => {
  it('capitalizes the first character only', () => {
    expect(toCapitalCase('hello')).toBe('Hello');
    expect(toCapitalCase('hello world')).toBe('Hello world');
    expect(toCapitalCase('Hello')).toBe('Hello');
  });

  it('handles the empty string', () => {
    expect(toCapitalCase('')).toBe('');
  });
});

describe('toCompactNotation', () => {
  it('compacts numbers at or above the threshold', () => {
    expect(toCompactNotation(1500, 'en', 1000)).toBe('1.5K');
    expect(toCompactNotation(2500000, 'en', 1000)).toBe('2.5M');
  });

  it('leaves numbers below the threshold in full notation', () => {
    expect(toCompactNotation(500, 'en', 1000)).toBe('500');
  });

  it('never compacts without a threshold', () => {
    expect(toCompactNotation(1500, 'en')).toBe('1,500');
  });

  it('accepts numeric strings', () => {
    expect(toCompactNotation('1500', 'en', 1000)).toBe('1.5K');
  });
});
