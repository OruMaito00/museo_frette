# AGENTS.md — museo_frette

On-Scroll 3D Carousel built with **Vite + React 19 + TypeScript + GSAP**.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server |
| `npm run build` | **Type-check first (`tsc -b`), then Vite build** — both must pass |
| `npm run preview` | Preview production build |
| `npm run test` | One-shot Vitest run |
| `npm run test:watch` | Vitest watch mode |

> There is **no lint or format script** configured. If you add one, wire it into `build` or document it here.

## TypeScript constraints that break builds

- `verbatimModuleSyntax: true` — **always** use `import type` for type-only imports. Plain imports of types will fail `tsc -b`.
- `noUnusedLocals: true` and `noUnusedParameters: true` — dead variables/parameters are hard errors.
- `erasableSyntaxOnly: true` — avoid enums, namespaces, and TS parameter properties.

## Project layout

- `src/main.tsx` → `App.tsx` — single entry point.
- `src/components/` — `Scene`, `Preview`, `Carousel`, `Card`, `PreviewGridItem`.
- `src/animations/` — GSAP-driven carousel, scroll, text-split, and transition logic.
- `src/data/scenes.ts` — hardcoded scene data (currently all scenes reuse `src/assets/img1.webp`).
- `src/types/index.ts` — shared interfaces (`SceneData`, `GridItemData`).

## GSAP / animation gotchas

- **ScrollSmoother is a premium GSAP plugin.** The project assumes it is available (Club/Business license). Do not swap it out for the free GSAP bundle.
- `createSmoother()` in `src/animations/gsapSetup.ts` **must** run after React has rendered `#smooth-wrapper` and `#smooth-content` into the DOM. `App.tsx` guards this inside a `useEffect`.
- Cleanup (`killSmoother`, `killAllCarousels`, `revertAllSplits`, `ScrollTrigger.kill()`) is mandatory in the `useEffect` teardown to avoid memory leaks and broken re-initializations.
- `ScrollTrigger.refresh()` is wired to `window.resize` in `App.tsx`.

## Testing

- **Vitest** with `jsdom`, globals enabled, and `setupFiles: ./src/setupTests.ts` (config lives in `vite.config.ts`).
- `src/setupTests.ts` only imports `@testing-library/jest-dom/vitest`.
- App-level tests (`src/__tests__/App.test.tsx`) **mock all animation modules** (`gsapSetup`, `carousel`, `chars`, `transitions`, `preloadImages`, `ScrollTrigger`). When writing new component tests, follow this pattern — GSAP logic depends on real browser APIs that jsdom does not provide.

## Build / deploy notes

- `tsconfig.json` uses project references (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Running `tsc -b` from the root compiles both.
- Output goes to `dist/` (standard Vite). `.gitignore` already ignores it.
- No CI, no pre-commit hooks, no formatter config in the repo today.
