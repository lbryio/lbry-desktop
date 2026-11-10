import {
  WORDLIST,
  cleanPhrase,
  normalizeLbryText,
  generateMnemonic,
  isValidBip39,
  checkPhrase,
  suggestWords,
  lbrySeed,
} from '../../util/wallet/mnemonic';

// Known BIP39 test vector (all-zero entropy).
const VECTOR_12 =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

describe('cleanPhrase', () => {
  it('lower-cases and collapses whitespace', () => {
    expect(cleanPhrase('  Abandon\tABANDON \n about ')).toBe('abandon abandon about');
  });
});

describe('normalizeLbryText', () => {
  it('strips combining marks and lowercases (lbry-sdk normalize_text)', () => {
    expect(normalizeLbryText('Café')).toBe('cafe');
  });

  it('removes whitespace between CJK characters', () => {
    expect(normalizeLbryText('你 好')).toBe('你好');
    expect(normalizeLbryText('hello 你 好 world')).toBe('hello 你好 world');
  });
});

describe('generateMnemonic / isValidBip39', () => {
  it('generates checksum-valid phrases of the requested length', () => {
    const twelve = generateMnemonic(12);
    const twentyFour = generateMnemonic(24);
    expect(twelve.split(' ')).toHaveLength(12);
    expect(twentyFour.split(' ')).toHaveLength(24);
    expect(isValidBip39(twelve)).toBe(true);
    expect(isValidBip39(twentyFour)).toBe(true);
  });

  it('accepts the known test vector and rejects a corrupted one', () => {
    expect(isValidBip39(VECTOR_12)).toBe(true);
    expect(isValidBip39(VECTOR_12.replace('about', 'abandon'))).toBe(false);
  });
});

describe('checkPhrase', () => {
  it('flags words outside the wordlist without rejecting the phrase', () => {
    const result = checkPhrase('abandon notaword about');
    expect(result.unknownWords).toEqual(['notaword']);
    expect(result.bip39Valid).toBe(false);
    expect(result.words).toHaveLength(3);
  });

  it('reports the test vector as fully valid', () => {
    const result = checkPhrase(VECTOR_12);
    expect(result.unknownWords).toEqual([]);
    expect(result.bip39Valid).toBe(true);
  });
});

describe('suggestWords', () => {
  it('suggests wordlist completions for a prefix', () => {
    expect(suggestWords('aband')).toEqual(['abandon']);
    expect(suggestWords('ab').length).toBeGreaterThan(1);
    expect(suggestWords('')).toEqual([]);
    expect(suggestWords('zzz')).toEqual([]);
  });
});

describe('lbrySeed', () => {
  it('derives a stable 64-byte seed (electrum-style, any phrase accepted)', () => {
    const seed = lbrySeed('not a checksummed phrase at all');
    expect(seed).toHaveLength(64);
    // Deterministic
    expect(Buffer.from(lbrySeed(VECTOR_12)).toString('hex')).toBe(
      Buffer.from(lbrySeed(VECTOR_12.toUpperCase())).toString('hex')
    );
  });
});

describe('WORDLIST', () => {
  it('is the 2048-word English BIP39 list', () => {
    expect(WORDLIST).toHaveLength(2048);
    expect(WORDLIST).toContain('abandon');
  });
});
