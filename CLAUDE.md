# Agentation (SolidJS Fork)

SolidJS port of [agentation](https://github.com/benjitaylor/agentation) (React). This fork tracks upstream and converts React patterns to SolidJS equivalents.

## Structure

- `package/` — the npm package (`agentation-solid`)
- `package/example/` — TanStack Start demo app (replaces upstream's Next.js docs site)

## Development

```bash
pnpm install    # Install all workspace dependencies
pnpm dev        # Run both package watch + example dev server
pnpm build      # Build package only
pnpm ship       # Patch bump + build + publish
```

## Important

The npm package is public. Changes to `package/src/` affect all users.

## Annotations

Whenever the user brings up annotations, fetch all the pending annotations before doing anything else. And infer whether I am referencing any annotations.

## Fork-Specific Patterns

These patterns exist only in the SolidJS fork and **must be preserved** during upstream syncs (`/sync-upstream`). They have no React equivalent.

### 1. SSR Wrapper (`package/src/index.tsx`)

The `Agentation` component wraps `PageFeedbackToolbarCSS` with SSR hydration handling. Detects hydration via `sharedConfig.context` and defers toolbar mount to a separate `render()` root via `setTimeout` to escape the hydration batch. Also calls `initOwnerTracking()` / `setRootOwner()` for component detection.

Upstream React has a simple re-export — do NOT overwrite this file during sync.

### 2. Component Detection (`package/src/utils/solid-detection.ts`)

SolidJS equivalent of upstream's `react-detection.ts`. Uses SolidJS owner tree tracking (`DEV.hooks.afterCreateOwner`) instead of React fiber walking. When upstream changes `react-detection.ts`, apply equivalent logic changes here — do not copy directly.

### 3. Store + Reconcile for `<For>` Stability

React uses `key={id}` on mapped elements to keep DOM nodes stable. SolidJS `<For>` tracks by reference identity, so new objects = destroyed DOM. Two files use `createStore` + `reconcile(data, { key: "id" })` to maintain proxy stability:

- **`design-mode/index.tsx`** — placements array
- **`design-mode/rearrange.tsx`** — sections array

Also in these files: IIFE children `{(() => ...)()}` were changed to reactive function children `{() => ...}` so text updates work with stable DOM nodes.

When syncing upstream changes to these files, preserve the store setup and `<For each={store.placements}>` / `<For each={sectionStore.items}>` patterns.

### 4. CSS `px()` Helper in Skeletons (`design-mode/skeletons.tsx`)

React auto-appends `px` to numeric inline style values. SolidJS does not. A `px()` helper converts numbers to `"Npx"` strings. All skeleton renderers use explicit `px` strings for every CSS property that requires units (gap, padding, margin, font-size, border-radius, width, height, etc.).

When upstream adds/modifies skeletons, convert all bare numeric style values to `px`-suffixed strings.

### 5. SCSS Workarounds (`design-mode/styles.module.scss`)

`darken()` and other Sass global built-in functions replaced with pre-computed hex values to avoid Dart Sass 3.0 deprecation warnings.

### 6. Build Config

- `tsup.config.ts` uses `tsup-preset-solid` with custom `scssModulesPlugin()`
- `package.json` exports include `"solid"` condition pointing to preserved `.jsx` files
- `globals.d.ts` adds `__DEV_MODE__` (not in upstream)

### 7. Systematic React → SolidJS Conversions

Every `.tsx` component file has these conversions applied. When syncing, apply the same rules to new/changed code:

| React | SolidJS |
|-------|---------|
| `className=` | `class=` |
| `strokeWidth=` (SVG) | `stroke-width=` |
| `useState` | `createSignal` (access via `value()`) |
| `useEffect` | `createEffect` / `onMount` / `onCleanup` |
| `useRef` | plain `let` variable |
| `useCallback` | plain function |
| `createPortal` | `<Portal>` |
| `forwardRef` / `useImperativeHandle` | callback ref prop |
| `{condition && <X/>}` | `<Show when={...}>` |
| `.map()` in JSX | `<For each={...}>` |
| `onChange` on text inputs | `onInput` |
| `React.CSSProperties` | `JSX.CSSProperties` |
| Numeric style values | Must add `px` suffix |

## What's NOT in This Fork

- **MCP server** — use upstream's `agentation-mcp` directly (framework-agnostic)
- **Docs/website** — `package/example/` is a minimal TanStack Start demo, not the upstream Next.js docs site
- **React tests** — upstream tests are React-specific and not ported
