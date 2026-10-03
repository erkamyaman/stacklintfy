import type { LayerFinding } from './lint-layer.js';

export interface StackPullRequest {
  number: number;
  state: string;
  draft: boolean;
  merged_at: string | null;
}

export interface Stack {
  number: number;
  pull_requests: StackPullRequest[];
}

export interface LayerReport {
  number: number;
  state: string;
  findings: LayerFinding[];
}

export function findStackFor(stacks: Stack[], pullNumber: number): Stack | undefined {
  return stacks.find((stack) => stack.pull_requests.some((pr) => pr.number === pullNumber));
}

export function summarizeStack(reports: LayerReport[]): string {
  const rows = reports.map((report, index) => {
    const status = report.findings.length ? report.findings.map((f) => f.message).join(' ') : 'ok';
    return `| ${index + 1} | #${report.number} | ${report.state} | ${status} |`;
  });
  return ['| Layer | PR | State | Findings |', '| --- | --- | --- | --- |', ...rows].join('\n');
}
