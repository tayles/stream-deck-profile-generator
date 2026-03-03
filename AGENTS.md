# AGENTS.md

`stream-deck-profile-generator` is a CLI tool and TypeScript library for generating Stream Deck profiles from CSV files containing hotkeys / keyboard shortcuts.

## Commands

```sh
bun install          # Install dependencies
bun run build        # Build the CLI + TypeScript library
bun run test         # Run all tests (uses bun test)
bun fix              # Format, lint and type check all files (and autofix where possible)
```

Run tests for a single file:

```sh
bun test src/utils/profile-utils.test.ts
```

### Key Conventions

- Formatting: **oxfmt**; Linting: **oxlint** with `--type-aware`.
- Tests live alongside source files (`.test.ts`).
- Always use `bun` instead of `npm` or `pnpm`, and `bunx` instead of `npx`.
- Always use `bun fix` to autofix formatting + lint issues at the end of a task.
- Use `bun fix` to run type checking instead of `tsx --noEmit` or `bun typecheck`.
