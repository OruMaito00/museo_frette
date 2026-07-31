# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

On-Scroll 3D Carousel built with **Vite + React 19 + TypeScript + GSAP + Three.js**.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server |
| `npm run build` | **Type-check first (`tsc -b`), then Vite build** — both must pass |
| `npm run preview` | Preview production build |
| `npm run test` | One-shot Vitest run |
| `npm run test:watch` | Vitest watch mode |

To run a single test file: `npx vitest run src/__tests__/App.test.tsx`. To run tests matching a name: `npx vitest run -t "pattern"`.

> There is **no lint or format script** configured. If you add one, wire it into `build` or document it here.

## TypeScript constraints that break builds

- `verbatimModuleSyntax: true` — **always** use `import type` for type-only imports. Plain imports of types will fail `tsc -b`.
- `noUnusedLocals: true` and `noUnusedParameters: true` — dead variables/parameters are hard errors.
- `erasableSyntaxOnly: true` — avoid enums, namespaces, and TS parameter properties.
- `tsconfig.json` uses project references (`tsconfig.app.json` for `src`, `tsconfig.node.json` for `vite.config.ts`). Running `tsc -b` from the root compiles both.

## Architecture

- `src/main.tsx` → `App.tsx` — single entry point.
- `src/components/` — `Scene`, `Preview`, `Carousel`, `Card`. `Preview` hosts the Three.js stage + UI overlays (detail strip, tag filter chips).
- `src/animations/` — GSAP-driven carousel/scroll/text-split logic **plus** `previewScene.ts` (imperative Three.js scene manager).
- `src/data/scenes.ts` — hardcoded scene data with `gridItems: { image, caption, description, tags[] }`.
- `src/types/index.ts` — shared interfaces (`SceneData`, `GridItemData`).

### GSAP / animation gotchas

- **ScrollSmoother is a premium GSAP plugin.** The project assumes it is available (Club/Business license). Do not swap it out for the free GSAP bundle.
- `createSmoother()` in `src/animations/gsapSetup.ts` **must** run after React has rendered `#smooth-wrapper` and `#smooth-content` into the DOM. `App.tsx` guards this inside a `useEffect`.
- Cleanup (`killSmoother`, `killAllCarousels`, `revertAllSplits`, `ScrollTrigger.kill()`) is mandatory in the `useEffect` teardown to avoid memory leaks and broken re-initializations.
- `ScrollTrigger.refresh()` is wired to `window.resize` in `App.tsx`.

### Three.js / preview gotchas

- **Imperative module, not R3F.** `previewScene.ts` owns the renderer, scene, camera, and OrbitControls lifecycle. React only provides the `.preview__stage` host div.
- **Click-to-focus:** raycaster on `pointerdown`/`pointerup` with drag guard (ignores drags from OrbitControls). Click a card → camera frames it, others fade. Click empty canvas or press **Escape** → restore.
- **Tag filter clustering:** `setTagFilter(tag)` toggles matching cards into a compact grid cluster, non-matching fade to `0.05`, and camera frames the group center. Click same tag again → scatter back to `homePosition`.
- **OrbitControls mode switching:**
  - Default: left-drag rotates
  - Tag active: left-drag pans (`mouseButtons.LEFT = THREE.MOUSE.PAN`)
  - Card focused: all dragging disabled
  - `syncControlMode()` handles the remap
- **React ↔ Three bridge:** `previewScene.ts` dispatches `preview:focus`, `preview:blur`, `preview:tag` custom events on the active `.preview` root. `Preview.tsx` listens and updates local state (detail strip, active chip).
- **Cleanup is critical:** `disposeActiveScene()` kills `raf`, removes listeners, disposes geometries/textures/renderer, resets module-level refs. Called on preview close and App unmount.

## Testing

- **Vitest** with `jsdom`, globals enabled, and `setupFiles: ./src/setupTests.ts` (config lives in `vite.config.ts`).
- `src/setupTests.ts` only imports `@testing-library/jest-dom/vitest`.
- App-level tests (`src/__tests__/App.test.tsx`) **mock all animation modules** (`gsapSetup`, `carousel`, `chars`, `transitions`, `preloadImages`, `ScrollTrigger`, `previewScene`). When writing new component tests, follow this pattern — GSAP / Three.js depend on real browser APIs that jsdom does not provide.

## Build / deploy notes

- Output goes to `dist/` (standard Vite). `.gitignore` already ignores it.
- No CI, no pre-commit hooks, no formatter config in the repo today.
- Three.js bundles statically (~900 kB JS chunk). The chunk-size warning on build is expected.

## Agent skills

### Issue tracker

Issues live as GitHub Issues on `github.com/OruMaito00/museo_frette` (via `gh` CLI). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
