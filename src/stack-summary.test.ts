import { describe, expect, it } from 'vitest';
import { findStackFor, summarizeStack, type Stack } from './stack-summary.js';

const stacks: Stack[] = [
  {
    number: 1,
    pull_requests: [
      { number: 10, state: 'open', draft: false, merged_at: null },
      { number: 11, state: 'open', draft: false, merged_at: null },
    ],
  },
  { number: 2, pull_requests: [{ number: 20, state: 'open', draft: false, merged_at: null }] },
];

describe('findStackFor', () => {
  it('finds the stack containing a pull request', () => {
    expect(findStackFor(stacks, 11)?.number).toBe(1);
  });

  it('returns undefined for a pull request outside any stack', () => {
    expect(findStackFor(stacks, 99)).toBeUndefined();
  });
});

describe('summarizeStack', () => {
  it('lists each layer in order with its findings', () => {
    const table = summarizeStack([
      { number: 10, state: 'open', findings: [] },
      { number: 11, state: 'open', findings: [{ rule: 'too-large', message: '500 changed lines' }] },
    ]);
    expect(table.split('\n')).toEqual([
      '| Layer | PR | State | Findings |',
      '| --- | --- | --- | --- |',
      '| 1 | #10 | open | ok |',
      '| 2 | #11 | open | 500 changed lines |',
    ]);
  });
});
