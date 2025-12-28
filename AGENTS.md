# AGENTS.md

Welcome, Agent! This document serves as your guide to working effectively within the `@jasset/upbit` repository. Please follow these conventions and instructions to ensure consistency and quality.

## Project Overview

`@jasset/upbit` is a lightweight, fully typed TypeScript client for the Upbit API. It aims to provide a pleasant developer experience with granular methods and full type safety.

## Tech Stack & Tooling

- **Runtime**: Node.js (compatible with Bun for development).
- **Language**: TypeScript (Strict mode).
- **Package Manager**: npm (lockfile present), but compatible with pnpm/yarn/bun.
- **Build Tool**: `tsup` for bundling (ESM & CJS).
- **Testing**: `vitest` for unit and integration tests.
- **Linting & Formatting**: `biome` (replaces ESLint/Prettier).

## Development Scripts

Use standard `npm run <script>` commands:

- `npm run dev`: Starts the playground environment locally.
- `npm run build`: Bundles the library using `tsup`.
- `npm run test`: Runs the test suite with `vitest`.
- `npm run lint`: Checks code formatting and linting with `biome`.
- `npm run format`: Fixes code formatting issues with `biome`.
- `npm run type-check`: Runs `tsc --noEmit` to verify type safety.

## Project Structure

- `src/`: Source code.
  - `api/`: Raw API implementations, organized by functionality (e.g., `exchange`, `quotation`).
  - `client/`: The main `UpbitClient` and sub-clients (`UpbitExchange`, `UpbitQuotation`).
  - `types/`: Shared TypeScript type definitions.
  - `normalizers/`: Functions to transform raw API responses into cleaner objects.
- `test/`: Test files mirroring the `src` structure.
- `playground/`: A sandbox application for manual testing and development.
- `dist/`: Build artifacts (not committed).

## Code Style & Conventions

- **Type Safety**: Avoid `any`. Use specific types or Generics. Define interface/types in `src/types.ts` or co-located if specific.
- **Formatting**: Always run `npm run format` (Biome) before committing.
- **Naming**:
  - Files: `kebab-case.ts` (e.g., `search-info.ts`).
  - Classes: `PascalCase`.
  - Functions/Variables: `camelCase`.
- **Exports**: Ensure new features are exported from the main entry point if they are public APIs.

## How to Add New API Endpoints

1.  **Define Types**: Add request/response interfaces in `src/types.ts` or a specific definition file.
2.  **Implement API Function**: Create a new function in `src/api/<category>/<endpoint>.ts`.
    - Use `AxiosInstance` for requests.
    - normalize responses if needed.
3.  **Expose in Client**:
    - Add the method to `UpbitExchange` or `UpbitQuotation` in `src/client/index.ts`.
    - Follow the existing method chaining pattern (e.g., `client.exchange.orders.bid.limit.post(...)`).
4.  **Test**: Add a corresponding test file in `test/api/...` using `nock` to mock HTTP requests.
5.  **Document**: Update `IMPLEMENTATION_STATUS.md` if applicable.

## Testing Instructions

- **Unit Tests**: We use `nock` to mock Upbit API responses. Do not make real network requests in unit tests.
- **Run Tests**: `npm run test`
- **Writing Tests**:
  - Place tests in `test/` folder matching `src/` path.
  - Files should end in `.test.ts`.
  - Use `describe`, `it`, `expect` from `vitest`.

## Commit Guidelines

- Use **Conventional Commits**:
  - `feat`: New feature.
  - `fix`: Bug fix.
  - `docs`: Documentation changes.
  - `refactor`: Code change that neither fixes a bug nor adds a feature.
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Changes to the build process or auxiliary tools.

Example: `feat: add candle implementation` or `fix: resolve type error in orderbook`
