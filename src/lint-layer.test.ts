import { describe, expect, it } from 'vitest';
import { lintLayer } from './lint-layer.js';

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
});
