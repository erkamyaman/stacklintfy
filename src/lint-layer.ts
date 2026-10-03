export interface LayerStats {
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface LayerFinding {
  rule: 'too-large' | 'too-many-files';
  message: string;
}

export const MAX_CHANGED_LINES = 400;
export const MAX_CHANGED_FILES = 20;

export function lintLayer(stats: LayerStats): LayerFinding[] {
  const findings: LayerFinding[] = [];
  const lines = stats.additions + stats.deletions;
  if (lines > MAX_CHANGED_LINES) {
    findings.push({
      rule: 'too-large',
      message: `${lines} changed lines (limit ${MAX_CHANGED_LINES}). Split this layer.`,
    });
  }
  if (stats.changedFiles > MAX_CHANGED_FILES) {
    findings.push({
      rule: 'too-many-files',
      message: `${stats.changedFiles} files changed (limit ${MAX_CHANGED_FILES}). Split this layer.`,
    });
  }
  return findings;
}
