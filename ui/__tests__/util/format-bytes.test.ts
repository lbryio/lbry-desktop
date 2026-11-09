import { formatBytes } from '../../util/format-bytes';

describe('formatBytes', () => {
  it('formats zero', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('stays in bytes below 1 KB', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('crosses unit boundaries at powers of 1024', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('keeps fractional values to the requested precision', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });

  it('treats negative decimals as zero', () => {
    expect(formatBytes(1536, -2)).toBe('2 KB');
  });
});
