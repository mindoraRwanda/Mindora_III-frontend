# MINDORA frontend CI patch v2

Apply the files in this archive to the root of your `Mindora_III-frontend` repository (the same local folder used by GitHub Desktop).

This version includes the previous CI/configuration patch and an additional TypeScript fix: `jest.setup.ts` is added to the root `tsconfig.json` include list, so the `@testing-library/jest-dom` matcher type augmentations (`toBeInTheDocument`, `toBeDisabled`, `toBeEnabled`) are visible to `tsc`.

Do not replace `.git` or any `.env` files. Review the GitHub Desktop Changes list before committing.

This patch does not resolve an unknown Jest runtime test failure. Re-run CI and inspect the `Tests` job log for that separate error.
