import { describe, expect, it } from 'vitest';
import { DEFAULT_LIMITS, lintLayer, parseLimits } from './lint-layer.js';

describe('lintLayer', () => {
  it('passes a small layer', () => {
    expect(lintLayer({ additions: 50, deletions: 10, changedFiles: 3 })).toEqual([]);
  });

  it('flags a layer with too many changed lines', () => {
    const findings = lintLayer({ additions: 300, deletions: 150, changedFiles: 3 });
    expect(findings.map((f) => f.rule)).toEqual(['too-large']);
  });

  it('flags a layer touching too many files', () => {
    const findings = lintLayer({ additions: 10, deletions: 0, changedFiles: 21 });
    expect(findings.map((f) => f.rule)).toEqual(['too-many-files']);
  });

  it('uses the limits it is given', () => {
    const limits = { maxChangedLines: 100, maxChangedFiles: 2 };
    const findings = lintLayer({ additions: 80, deletions: 30, changedFiles: 3 }, limits);
    expect(findings.map((f) => f.rule)).toEqual(['too-large', 'too-many-files']);
  });
});

describe('parseLimits', () => {
  it('returns the defaults for a missing config', () => {
    expect(parseLimits(null)).toEqual(DEFAULT_LIMITS);
    expect(parseLimits(undefined)).toEqual(DEFAULT_LIMITS);
  });

  it('reads valid values', () => {
    expect(parseLimits({ maxChangedLines: 150, maxChangedFiles: 5 })).toEqual({
      maxChangedLines: 150,
      maxChangedFiles: 5,
    });
  });

  it('falls back per field for invalid values', () => {
    expect(parseLimits({ maxChangedLines: -1, maxChangedFiles: '5' })).toEqual(DEFAULT_LIMITS);
    expect(parseLimits({ maxChangedLines: 150.5 })).toEqual(DEFAULT_LIMITS);
  });
});
