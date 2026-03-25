# Sync Upstream React → SolidJS

Pull the latest changes from the upstream React agentation repo and port them to SolidJS.

**Before starting, read `CLAUDE.md` — the "Fork-Specific Patterns" section is the authoritative reference for what must be preserved.**

## Steps

### 1. Fetch upstream changes

Check if the `upstream` remote exists. If not, add it:
```
git remote add upstream https://github.com/benjitaylor/agentation.git
```

Fetch the latest from upstream main:
```
git fetch upstream main
```

### 2. Diff upstream against our last sync

Show what changed in the upstream `package/src/` directory since our current HEAD:
```
git diff HEAD...upstream/main -- package/src/
```

Also check for new files:
```
git diff HEAD...upstream/main --name-status -- package/src/
```

Summarize the changes for me before proceeding. Group them by:
- **New files** added upstream
- **Modified files** with a brief description of what changed
- **Deleted files**

**Ignore** changes to these upstream-only paths (we don't track them):
- `mcp/` — we use upstream's MCP package directly
- `package/example/` — our example app is entirely different (TanStack Start, not Next.js)

### 3. Apply changes file by file

For each changed upstream file, apply the SolidJS conversion:

**Framework-agnostic files** (utils like element-identification.ts, storage.ts, sync.ts, freeze-animations.ts, types.ts):
- These can usually be copied directly. Diff carefully and merge.

**React component files** (anything in components/):
- Do NOT copy directly. Instead, read the upstream diff and manually apply the equivalent change to our SolidJS version.
- Follow these conversion rules:
  - `useState` → `createSignal` (access via `value()`)
  - `useEffect` → `createEffect` / `onMount` / `onCleanup`
  - `useRef` → plain `let` variables
  - `useCallback` → plain functions
  - `createPortal` → `<Portal>`
  - `forwardRef/useImperativeHandle` → callback ref prop
  - `className` → `class`
  - SVG attributes: camelCase → kebab-case (`strokeWidth` → `stroke-width`)
  - `{condition && <X/>}` → `<Show when={...}>`
  - `.map()` → `<For each={...}>`
  - Props accessed via `props.xxx` (never destructure)
  - `onChange` on text inputs → `onInput`
  - `React.CSSProperties` → `JSX.CSSProperties`
  - `React.MouseEvent` → native `MouseEvent`
  - Numeric inline style values → must add `px` suffix (SolidJS doesn't auto-append like React)

**React-specific files** (react-detection.ts, source-location.ts):
- If react-detection.ts changed, apply equivalent logic changes to our `solid-detection.ts`
- If source-location.ts changed, check if new features can be adapted (most React fiber stuff won't apply)

**CSS/SCSS files**:
- Copy directly, BUT replace any `darken()`, `lighten()`, or other Sass global built-in functions with pre-computed hex values (avoids Dart Sass 3.0 deprecation warnings).

**generate-output.ts**:
- Usually safe to copy directly, but verify it doesn't import new React-specific modules.

### 4. Preserve fork-specific patterns

**CRITICAL**: These patterns exist only in our fork. Never overwrite them with upstream code.

#### `package/src/index.tsx` — SSR wrapper
- Do NOT replace with upstream's simple re-export (`index.ts`)
- Our version wraps the toolbar with `sharedConfig.context` hydration detection
- If upstream changes exports, update our wrapper to match the new exports

#### `package/src/utils/solid-detection.ts` — Component detection
- Do NOT replace with upstream's `react-detection.ts`
- If upstream changes detection logic, port the equivalent concept here

#### `design-mode/index.tsx` — Store + reconcile for placements
- Preserve the `createStore` + `reconcile(props.placements, { key: "id" })` pattern
- Preserve `<For each={store.placements}>` (not `props.placements`)
- Preserve reactive function children: `{() => <Skeleton ...>}` (not IIFE `{(() => ...)()}`)
- Preserve reactive annotation text: `{() => { ... }}` (not IIFE)

#### `design-mode/rearrange.tsx` — Store + reconcile for sections
- Preserve the `createStore` + `reconcile(props.rearrangeState.sections, { key: "id" })` pattern
- Preserve `const sections = () => sectionStore.items`
- Preserve reactive annotation text children

#### `design-mode/skeletons.tsx` — px helper
- Preserve the `px()` helper function at the top of the file
- Any new skeleton renderers from upstream need all numeric style values converted to `px`-suffixed strings
- `Bar`, `Block`, `Circle` base components already handle px — preserve their implementations

#### `globals.d.ts`
- Preserve the `__DEV_MODE__` declaration (not in upstream)

### 5. Verify the port

After applying changes:
1. Run `cd package && pnpm build` — must compile with zero errors
2. Check no React imports leaked in: `grep -r "from ['\"]react" package/src/`
3. Check no `className` in JSX: `grep -r "className[={]" package/src/`
4. Check no bare numeric style values in skeletons: `grep -E "gap: [0-9]|padding: [0-9]|margin.*: [0-9]|height: [0-9]|width: [0-9]" package/src/components/design-mode/skeletons.tsx` (should return nothing)
5. Verify the `reactComponents` field name is preserved (MCP schema compat)

### 6. Report

Summarize what was synced:
- List of upstream changes applied
- Any changes that couldn't be ported (and why)
- Any new features that need manual testing
- Any new skeleton renderers that needed px conversion

Do NOT commit automatically — let me review first.
