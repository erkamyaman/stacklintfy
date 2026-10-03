# stacklint

GitHub App that lints each layer of a stacked pull request and (planned) posts one stack summary comment.

Working name, not final.

## Status

- Check run per PR from size rules (`src/lint-layer.ts`).
- The `stack` webhook object is only logged. Its shape is undocumented in the overview docs; read the logged payload before using it.

## Configure

Add `.github/stacklint.yml` to a repo to change the limits. Both fields are optional.

```yaml
maxChangedLines: 400
maxChangedFiles: 20
```

The app needs the **Contents: read** permission to read this file. Without it the defaults apply.

## Run

```sh
pnpm install
cp .env.example .env
pnpm test
pnpm build && pnpm start
```
