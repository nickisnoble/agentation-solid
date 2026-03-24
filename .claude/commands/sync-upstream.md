# Sync Upstream React → SolidJS

Pull the latest changes from the upstream React agentation repo and port them to SolidJS.

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

**React-specific files** (react-detection.ts, source-location.ts):
- If react-detection.ts changed, apply equivalent logic changes to our `solid-detection.ts`
- If source-location.ts changed, check if new features can be adapted (most React fiber stuff won't apply)

**CSS/SCSS files**:
- Copy directly — no changes needed.

**generate-output.ts**:
- Usually safe to copy directly, but verify it doesn't import new React-specific modules.

### 4. Verify the port

After applying changes:
1. Run `cd package && pnpm build` — must compile with zero errors
2. Check no React imports leaked in: `grep -r "from ['\"]react" package/src/`
3. Check no `className` in JSX: `grep -r "className[={]" package/src/`
4. Verify the `reactComponents` field name is preserved (MCP schema compat)

### 5. Report

Summarize what was synced:
- List of upstream changes applied
- Any changes that couldn't be ported (and why)
- Any new features that need manual testing

Do NOT commit automatically — let me review first.
