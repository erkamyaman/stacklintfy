export interface LayerStats {
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface LayerFinding {
  rule: 'too-large' | 'too-many-files';
  message: string;
}

export interface LayerLimits {
  maxChangedLines: number;
  maxChangedFiles: number;
}

export const DEFAULT_LIMITS: LayerLimits = {
  maxChangedLines: 400,
  maxChangedFiles: 20,
};

export function parseLimits(raw: unknown): LayerLimits {
  const source = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    maxChangedLines: positiveInteger(source['maxChangedLines'], DEFAULT_LIMITS.maxChangedLines),
    maxChangedFiles: positiveInteger(source['maxChangedFiles'], DEFAULT_LIMITS.maxChangedFiles),
  };
}

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}

export function lintLayer(stats: LayerStats, limits: LayerLimits = DEFAULT_LIMITS): LayerFinding[] {
  const findings: LayerFinding[] = [];
  const lines = stats.additions + stats.deletions;
  if (lines > limits.maxChangedLines) {
    findings.push({
      rule: 'too-large',
      message: `${lines} changed lines (limit ${limits.maxChangedLines}). Split this layer.`,
    });
  }
  if (stats.changedFiles > limits.maxChangedFiles) {
    findings.push({
      rule: 'too-many-files',
      message: `${stats.changedFiles} files changed (limit ${limits.maxChangedFiles}). Split this layer.`,
    });
  }
  return findings;
}
