# stacklint

GitHub App that lints each layer of a stacked pull request and (planned) posts one stack summary comment.

Working name, not final.

## Status

- Check run per PR from size rules (`src/lint-layer.ts`).
- The `stack` webhook object is only logged. Its shape is undocumented in the overview docs; read the logged payload before using it.

## Run

```sh
pnpm install
cp .env.example .env
pnpm test
pnpm build && pnpm start
```
