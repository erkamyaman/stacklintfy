import type { Probot } from 'probot';
import { lintLayer } from './lint-layer.js';
import { findStackFor, summarizeStack, type LayerReport, type Stack } from './stack-summary.js';

export default (app: Probot) => {
  app.on(
    ['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'],
    async (context) => {
      const pr = context.payload.pull_request;
      context.log.info({ stack: (context.payload as { stack?: unknown }).stack }, 'stack payload');

      const findings = lintLayer({
        additions: pr.additions ?? 0,
        deletions: pr.deletions ?? 0,
        changedFiles: pr.changed_files ?? 0,
      });

      let summary = findings.length ? findings.map((f) => `- ${f.message}`).join('\n') : 'No findings.';

      try {
        const { data: stacks } = await context.octokit.request('GET /repos/{owner}/{repo}/stacks', context.repo());
        const stack = findStackFor(stacks as Stack[], pr.number);
        if (stack) {
          const reports: LayerReport[] = [];
          for (const layer of stack.pull_requests) {
            const { data } = await context.octokit.rest.pulls.get(context.repo({ pull_number: layer.number }));
            reports.push({
              number: layer.number,
              state: layer.merged_at ? 'merged' : layer.state,
              findings: lintLayer({
                additions: data.additions,
                deletions: data.deletions,
                changedFiles: data.changed_files,
              }),
            });
          }
          summary = `${summary}\n\nStack #${stack.number}\n\n${summarizeStack(reports)}`;
        }
      } catch (error) {
        context.log.warn({ error }, 'could not read stacks');
      }

      await context.octokit.rest.checks.create(
        context.repo({
          name: 'stacklint',
          head_sha: pr.head.sha,
          status: 'completed',
          conclusion: findings.length ? 'neutral' : 'success',
          output: {
            title: findings.length ? 'Layer is too big' : 'Layer looks fine',
            summary,
          },
        }),
      );
    },
  );
};
