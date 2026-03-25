// =============================================================================
// Solid Component Name Detection
// Uses Solid's dev-mode owner tree to extract component names from DOM elements.
//
// SolidJS (unlike React) does NOT attach owner/fiber info to DOM elements.
// Instead, component computations in the owner tree store their rendered DOM
// in `value`/`tValue`. We walk the owner tree from a captured root to find
// which components contain a given element.
// =============================================================================

import { DEV } from "solid-js";

// =============================================================================
// Default Filter Configuration
// =============================================================================

/**
 * Default exact names to always skip (framework internals)
 */
export const DEFAULT_SKIP_EXACT = new Set([
  "Fragment",
  "Suspense",
  "Routes",
  "Route",
  "Outlet",
  // Framework internals - exact matches
  "Root",
  "ErrorBoundaryHandler",
  "HotReload",
  "Hot",
  // Solid-specific internals
  "Show",
  "For",
  "Index",
  "Switch",
  "Match",
  "Dynamic",
  "Portal",
  "ErrorBoundary",
  // Context providers (Solid often lowercases these)
  "provider",
  // TanStack Router internals
  "MatchesInner",
  "Matches",
  "CatchBoundary",
  "CatchBoundaryImpl",
  "RouterProvider",
]);

/**
 * Default patterns for framework internals
 * Note: Patterns are designed to be specific to avoid false positives
 * (e.g., ServerStatus, ClientProfile should NOT be filtered)
 */
export const DEFAULT_SKIP_PATTERNS: RegExp[] = [
  /Boundary$/, // ErrorBoundary, RedirectBoundary
  /BoundaryHandler$/, // ErrorBoundaryHandler
  /[Pp]rovider$/, // ThemeProvider, Context.Provider, provider
  /Consumer$/, // Context.Consumer
  /^(Inner|Outer)/, // InnerLayoutRouter
  /Router$/, // AppRouter, BrowserRouter
  /Context$/, // LayoutRouterContext
  /^Hot(Reload)?$/, // HotReload (exact match to avoid false positives)
  /^(Dev|Solid)(Overlay|Tools|Root)/, // DevTools, SolidDevOverlay
  /Overlay$/, // DevOverlay, ErrorOverlay
  /Handler$/, // ScrollAndFocusHandler, ErrorBoundaryHandler
  /^With[A-Z]/, // withRouter, WithAuth (HOCs)
  /Wrapper$/, // Generic wrappers
  /^Root(Component|Layout|Route)?$/, // Generic Root, RootComponent, RootLayout
  /^Matches/, // TanStack Router: Matches, MatchesInner
];

/**
 * Patterns that indicate likely user-defined components
 * Used as fallback in 'smart' mode
 */
const DEFAULT_USER_PATTERNS: RegExp[] = [
  /Page$/, // HomePage, InstallPage
  /View$/, // ListView, DetailView
  /Screen$/, // HomeScreen
  /Section$/, // HeroSection
  /Card$/, // ProductCard
  /List$/, // UserList
  /Item$/, // ListItem, MenuItem
  /Form$/, // LoginForm
  /Modal$/, // ConfirmModal
  /Dialog$/, // AlertDialog
  /Button$/, // SubmitButton (but not all buttons)
  /Nav$/, // SideNav, TopNav
  /Header$/, // PageHeader
  /Footer$/, // PageFooter
  /Layout$/, // MainLayout (careful - could be framework)
  /Panel$/, // SidePanel
  /Tab$/, // SettingsTab
  /Menu$/, // DropdownMenu
];

// =============================================================================
// Configuration Types
// =============================================================================

export type SolidDetectionMode = "all" | "filtered" | "smart";

export interface SolidDetectionConfig {
  /**
   * How many component names to collect
   * @default 3
   */
  maxComponents?: number;

  /**
   * Maximum owner depth to traverse
   * @default 25
   */
  maxDepth?: number;

  /**
   * Detection mode:
   * - 'smart': Only show components that correlate with DOM classes (strictest, most relevant)
   * - 'filtered': Skip known framework internals (default)
   * - 'all': Show all components (no filtering)
   * @default 'filtered'
   */
  mode?: SolidDetectionMode;

  /**
   * Additional exact names to skip (merged with defaults in 'filtered' mode)
   */
  skipExact?: Set<string> | string[];

  /**
   * Additional patterns to skip (merged with defaults in 'filtered' mode)
   */
  skipPatterns?: RegExp[];

  /**
   * Patterns for user components (used as fallback in 'smart' mode)
   */
  userPatterns?: RegExp[];

  /**
   * Custom filter function for full control
   * Return true to INCLUDE the component, false to skip
   */
  filter?: (name: string, depth: number) => boolean;
}

/**
 * Resolved configuration with all defaults applied
 */
interface ResolvedConfig {
  maxComponents: number;
  maxDepth: number;
  mode: SolidDetectionMode;
  skipExact: Set<string>;
  skipPatterns: RegExp[];
  userPatterns: RegExp[];
  filter?: (name: string, depth: number) => boolean;
}

function resolveConfig(config?: SolidDetectionConfig): ResolvedConfig {
  const mode = config?.mode ?? "filtered";

  // Convert skipExact to Set if array
  let skipExact = DEFAULT_SKIP_EXACT;
  if (config?.skipExact) {
    const additional =
      config.skipExact instanceof Set
        ? config.skipExact
        : new Set(config.skipExact);
    skipExact = new Set([...DEFAULT_SKIP_EXACT, ...additional]);
  }

  return {
    maxComponents: config?.maxComponents ?? 6,
    maxDepth: config?.maxDepth ?? 30,
    mode,
    skipExact,
    skipPatterns: config?.skipPatterns
      ? [...DEFAULT_SKIP_PATTERNS, ...config.skipPatterns]
      : DEFAULT_SKIP_PATTERNS,
    userPatterns: config?.userPatterns ?? DEFAULT_USER_PATTERNS,
    filter: config?.filter,
  };
}

// =============================================================================
// Filter Logic
// =============================================================================

/**
 * Normalize a component name to match CSS class conventions
 * SideNav -> side-nav, LinkComponent -> link-component
 */
function normalizeComponentName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Collect CSS classes from an element and its ancestors
 */
function getAncestorClasses(element: HTMLElement, maxDepth = 10): Set<string> {
  const classes = new Set<string>();
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < maxDepth) {
    if (current.className && typeof current.className === "string") {
      current.className.split(/\s+/).forEach((cls) => {
        if (cls.length > 1) {
          // Normalize: remove CSS module hashes, convert to lowercase
          const normalized = cls
            .replace(/[_][a-zA-Z0-9]{5,}.*$/, "")
            .toLowerCase();
          if (normalized.length > 1) {
            classes.add(normalized);
          }
        }
      });
    }
    current = current.parentElement;
    depth++;
  }

  return classes;
}

/**
 * Check if a component name correlates with any DOM class
 */
function componentCorrelatesWithDOM(
  componentName: string,
  domClasses: Set<string>,
): boolean {
  const normalized = normalizeComponentName(componentName);

  for (const cls of domClasses) {
    // Exact match: SideNav -> side-nav
    if (cls === normalized) return true;

    // Contains match: LinkComponent -> nav-link contains "link"
    // Split both by hyphens and check for word overlaps
    const componentWords = normalized.split("-").filter((w) => w.length > 2);
    const classWords = cls.split("-").filter((w) => w.length > 2);

    for (const cWord of componentWords) {
      for (const dWord of classWords) {
        if (cWord === dWord || cWord.includes(dWord) || dWord.includes(cWord)) {
          return true;
        }
      }
    }
  }

  return false;
}

function shouldIncludeComponent(
  name: string,
  depth: number,
  config: ResolvedConfig,
  domClasses?: Set<string>,
): boolean {
  // Custom filter takes precedence
  if (config.filter) {
    return config.filter(name, depth);
  }

  switch (config.mode) {
    case "all":
      // "all" mode shows everything - no filtering at all
      return true;

    case "filtered":
      // "filtered" mode skips framework internals
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      return true;

    case "smart":
      // "smart" mode: first apply framework filters, then require DOM correlation
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      // Must correlate with DOM classes OR match user patterns
      if (domClasses && componentCorrelatesWithDOM(name, domClasses)) {
        return true;
      }
      if (config.userPatterns.some((p) => p.test(name))) {
        return true;
      }
      // Skip components that don't correlate - this mode is intentionally strict
      return false;

    default:
      return true;
  }
}

// =============================================================================
// Solid Owner Tree Types
// =============================================================================

/**
 * Solid's internal owner/computation structure (dev mode only).
 * In dev builds, `devComponent` creates a computation with `name` set to the
 * component function name, `component` set to the function itself, and
 * `value`/`tValue` holding the rendered DOM output.
 */
interface SolidOwner {
  name?: string;
  componentName?: string;
  component?: Function;
  owner?: SolidOwner | null;
  parent?: SolidOwner | null;
  owned?: SolidOwner[] | null;
  sourceMap?: SolidOwner[];
  value?: unknown;
  tValue?: unknown;
}

// =============================================================================
// Root Owner Management & Global Owner Tracking
// =============================================================================

let rootOwner: SolidOwner | null = null;

// Flat set of all component owners across ALL render roots.
// Populated via DEV.hooks.afterCreateOwner (installed at module load).
const trackedComponentOwners = new Set<SolidOwner>();

let ownerTrackingInstalled = false;

function installOwnerHook(): void {
  if (ownerTrackingInstalled || typeof window === "undefined") return;

  try {
    // DEV is only defined in development builds of solid-js
    if (!DEV?.hooks) return;

    ownerTrackingInstalled = true;
    const prev = DEV.hooks.afterCreateOwner;
    DEV.hooks.afterCreateOwner = (owner: any) => {
      // name/component are set by devComponent AFTER createComputation returns,
      // so defer the check to let those fields be populated
      queueMicrotask(() => {
        if (owner && owner.component && owner.name) {
          trackedComponentOwners.add(owner as SolidOwner);
        }
      });
      if (typeof prev === "function") prev(owner);
    };
  } catch {
    // DEV hooks not available (production build or SSR)
  }
}

// Install hook at module load time so we capture ALL component owners,
// including those created before <Agentation /> renders.
installOwnerHook();

/**
 * Install a hook on Solid's DEV.hooks.afterCreateOwner to track every
 * component owner that gets created — including in separate render() roots.
 * Safe to call multiple times (idempotent).
 */
export function initOwnerTracking(): void {
  installOwnerHook();
}

/**
 * Store a reference to the Solid root owner for tree-walk detection.
 * Call this during agentation init (e.g. from a captured `getOwner()`).
 */
export function setRootOwner(owner: unknown): void {
  if (owner && typeof owner === "object") {
    // Walk up to find the true root
    let current = owner as SolidOwner;
    while (current.owner && typeof current.owner === "object") {
      current = current.owner;
    }
    rootOwner = current;
  }
}

// =============================================================================
// Solid Detection
// =============================================================================

let solidDetectionCache: boolean | null = null;

// Only cache for 'all' mode - filtered modes should NOT cache because:
// 1. Filter results depend on config that may change between calls
// 2. Cached results from before filter changes would return stale/unfiltered data
// 3. The cache lookup happens BEFORE filtering, so old cached data bypasses filters
// Using WeakMap allows garbage collection when elements are removed from DOM.
let componentCacheAll = new WeakMap<HTMLElement, SolidComponentInfo>();

/**
 * Checks if Solid is present on the page.
 * Uses multiple detection strategies including globals and root owner.
 */
export function isSolidPage(): boolean {
  if (solidDetectionCache !== null) {
    return solidDetectionCache;
  }

  if (typeof document === "undefined") {
    return false;
  }

  // Check if we have a captured root owner (most reliable)
  if (rootOwner) {
    solidDetectionCache = true;
    return true;
  }

  // Check for Solid's global marker (set by solid-js dev.js)
  try {
    if (
      typeof globalThis !== "undefined" &&
      (globalThis as Record<string, unknown>).Solid$$
    ) {
      solidDetectionCache = true;
      return true;
    }
  } catch {
    // Ignore access errors
  }

  // Check for Solid DevTools hook
  try {
    if (
      typeof window !== "undefined" &&
      (window as unknown as Record<string, unknown>).__SOLID_DEVTOOLS_GLOBAL_HOOK__
    ) {
      solidDetectionCache = true;
      return true;
    }
  } catch {
    // Ignore access errors
  }

  // Check DOM elements for owner properties (legacy fallback)
  if (document.body) {
    for (const child of document.body.children) {
      if (hasOwnerProperty(child)) {
        solidDetectionCache = true;
        return true;
      }
    }
  }

  solidDetectionCache = false;
  return false;
}

/**
 * Check if an element has any owner-like properties (legacy detection)
 */
function hasOwnerProperty(element: Element): boolean {
  try {
    const keys = Object.keys(element);
    if (
      keys.some(
        (key) =>
          key === "__$owner" ||
          key.startsWith("__solid") ||
          key.startsWith("__owner"),
      )
    ) {
      return true;
    }
  } catch {
    // Property access may fail
  }
  return false;
}

/**
 * Clears the Solid detection cache
 * Note: Only 'all' mode uses caching; filtered modes don't cache to avoid stale filter results
 */
export function clearSolidDetectionCache(): void {
  solidDetectionCache = null;
  componentCacheAll = new WeakMap<HTMLElement, SolidComponentInfo>();
}

// =============================================================================
// Owner Tree Walking
// =============================================================================

/**
 * Check if an owner's rendered DOM output contains or equals the target element
 */
function ownerContainsElement(owner: SolidOwner, target: HTMLElement): boolean {
  let dom = owner.tValue !== undefined ? owner.tValue : owner.value;
  if (!dom) return false;

  // SolidJS (especially with solid-refresh HMR) may store a signal accessor
  // rather than the DOM node directly. Call it to resolve the actual value.
  if (typeof dom === "function") {
    try {
      dom = (dom as Function)();
    } catch {
      return false;
    }
  }

  if (!dom) return false;

  if (dom instanceof Node) {
    return dom === target || dom.contains(target);
  }

  if (Array.isArray(dom)) {
    for (const item of dom) {
      if (item instanceof Node && (item === target || item.contains(target))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Walk the owner tree from root, collecting component owners that contain
 * the target element. Results are ordered outermost → innermost.
 */
interface TreeWalkResult {
  components: string[];
  innermostElement?: Node;
}

function collectComponentsFromTree(
  root: SolidOwner,
  target: HTMLElement,
  config: ResolvedConfig,
  domClasses?: Set<string>,
): TreeWalkResult {
  const components: string[] = [];
  let innermostElement: Node | undefined;
  const visited = new WeakSet<SolidOwner>();
  let depth = 0;

  function walk(owner: SolidOwner): void {
    if (
      components.length >= config.maxComponents ||
      depth >= config.maxDepth ||
      visited.has(owner)
    ) {
      return;
    }
    visited.add(owner);

    const rawName = owner.name || owner.componentName;
    if (rawName && typeof rawName === "string") {
      // Accept owners with owner.component set (standard dev mode) OR
      // owners with PascalCase names that have DOM output (catches hydrated
      // components where devComponent may not set owner.component).
      const isComponent = owner.component || /^[A-Z]/.test(rawName);
      if (isComponent) {
        const name = rawName.replace(/^\[solid-refresh\]/, "");
        if (
          !isMinifiedName(name) &&
          ownerContainsElement(owner, target) &&
          shouldIncludeComponent(name, depth, config, domClasses)
        ) {
          components.push(name);
          // Track the innermost component's DOM element for relative paths
          const dom = resolveOwnerDom(owner);
          if (dom instanceof Node) {
            innermostElement = dom;
          }
        }
      }
    }

    depth++;
    if (owner.owned) {
      for (const child of owner.owned) {
        if (child && typeof child === "object") {
          walk(child);
        }
      }
    }
    depth--;
  }

  walk(root);
  return { components, innermostElement };
}

/**
 * Resolve the DOM output from an owner, handling signal accessors.
 */
function resolveOwnerDom(owner: SolidOwner): unknown {
  let dom = owner.tValue !== undefined ? owner.tValue : owner.value;
  if (typeof dom === "function") {
    try {
      dom = (dom as Function)();
    } catch {
      return null;
    }
  }
  return dom;
}

/**
 * Attempt to extract the Solid owner from a DOM element directly.
 * Fallback for environments that stamp owner info on elements.
 */
function getOwnerFromElement(element: HTMLElement): SolidOwner | null {
  try {
    const record = element as unknown as Record<string | symbol, unknown>;

    // Check for __$owner (some Solid tooling attaches this)
    if (record.__$owner && typeof record.__$owner === "object") {
      return record.__$owner as SolidOwner;
    }

    // Check string keys matching Solid patterns
    const keys = Object.keys(element);
    for (const key of keys) {
      if (
        key.startsWith("__solid") ||
        key.startsWith("__owner") ||
        key.includes("owner")
      ) {
        const value = record[key];
        if (value && typeof value === "object") {
          const candidate = value as Record<string, unknown>;
          if (
            "name" in candidate ||
            "componentName" in candidate ||
            "owner" in candidate ||
            "parent" in candidate
          ) {
            return candidate as unknown as SolidOwner;
          }
        }
      }
    }

    // Check Symbol properties
    const symbols = Object.getOwnPropertySymbols(element);
    for (const sym of symbols) {
      const desc = sym.description || String(sym);
      if (
        desc.includes("solid") ||
        desc.includes("owner") ||
        desc.includes("SOLID")
      ) {
        const value = record[sym];
        if (value && typeof value === "object") {
          const candidate = value as Record<string, unknown>;
          if (
            "name" in candidate ||
            "componentName" in candidate ||
            "owner" in candidate ||
            "parent" in candidate
          ) {
            return candidate as unknown as SolidOwner;
          }
        }
      }
    }
  } catch {
    // Property access may throw in edge cases
  }

  return null;
}

/**
 * Extract the component name from a Solid owner node.
 */
function getNameFromOwner(owner: SolidOwner): string | null {
  if (owner.componentName && typeof owner.componentName === "string") {
    return owner.componentName;
  }
  if (owner.name && typeof owner.name === "string") {
    return owner.name;
  }
  return null;
}

/**
 * Get the parent owner (Solid uses "owner" or "parent" depending on version)
 */
function getParentOwner(owner: SolidOwner): SolidOwner | null {
  if (owner.owner && typeof owner.owner === "object") {
    return owner.owner;
  }
  if (owner.parent && typeof owner.parent === "object") {
    return owner.parent;
  }
  return null;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Result from Solid component detection
 */
export interface SolidComponentInfo {
  /** Full component path like "<App> <Layout> <Button>" */
  path: string | null;
  /** Array of component names from outermost to innermost */
  components: string[];
  /** DOM node of the innermost detected component (for relative paths) */
  innermostElement?: Node;
}

/**
 * Check if a name looks like minified/production code (single letter or very short)
 */
function isMinifiedName(name: string): boolean {
  // Single letter or two letters that look like minified (e.g., "e", "t", "Zt")
  if (name.length <= 2) return true;
  // All lowercase short names are likely minified
  if (name.length <= 3 && name === name.toLowerCase()) return true;
  return false;
}

/**
 * Finds Solid component names for a DOM element.
 *
 * Primary strategy: walk the captured root owner tree and find component
 * owners whose rendered DOM contains the target element.
 * Fallback: check for owner properties directly on the element (for
 * environments with Solid DevTools or similar tooling).
 */
export function getSolidComponentName(
  element: HTMLElement,
  config?: SolidDetectionConfig,
): SolidComponentInfo {
  const resolved = resolveConfig(config);

  const useCache = resolved.mode === "all";

  if (useCache) {
    const cached = componentCacheAll.get(element);
    if (cached !== undefined) {
      return cached;
    }
  }

  if (!isSolidPage()) {
    const result: SolidComponentInfo = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result);
    }
    return result;
  }

  const domClasses =
    resolved.mode === "smart" ? getAncestorClasses(element) : undefined;

  let components: string[] = [];
  let innermostElement: Node | undefined;

  // Strategy 1: walk the root owner tree (catches main-tree components)
  if (rootOwner) {
    try {
      const treeResult = collectComponentsFromTree(
        rootOwner,
        element,
        resolved,
        domClasses,
      );
      components = treeResult.components;
      innermostElement = treeResult.innermostElement;
    } catch {
      // Tree walk may fail on complex/circular owner structures
    }
  }

  // Strategy 2: check tracked component owners from DEV hooks
  // Merges with Strategy 1 results to catch components that the tree walk
  // missed (e.g. components created before rootOwner was captured, or
  // components in separate render() roots like client-only islands).
  if (trackedComponentOwners.size > 0) {
    try {
      const existingNames = new Set(components);
      const matches: { name: string; depth: number; owner: SolidOwner }[] = [];
      for (const owner of trackedComponentOwners) {
        if (ownerContainsElement(owner, element)) {
          const rawName = owner.name || owner.componentName;
          if (rawName && typeof rawName === "string") {
            // Strip vite HMR wrapper prefix: "[solid-refresh]Foo" → "Foo"
            const name = rawName.replace(/^\[solid-refresh\]/, "");
            if (
              !existingNames.has(name) &&
              !isMinifiedName(name) &&
              shouldIncludeComponent(name, 0, resolved, domClasses)
            ) {
              let depth = 0;
              let p: SolidOwner | null | undefined = owner.owner;
              while (p && depth < 50) {
                depth++;
                p = p.owner || p.parent;
              }
              matches.push({ name, depth, owner });
            }
          }
        }
      }
      if (matches.length > 0) {
        matches.sort((a, b) => a.depth - b.depth);
        const tracked = matches.map((m) => m.name);
        // Merge: use tracked owners as primary (more complete), deduplicated
        const merged = [...tracked];
        for (const name of components) {
          if (!merged.includes(name)) merged.push(name);
        }
        components = merged.slice(0, resolved.maxComponents);
        // Update innermost element from the deepest tracked match
        const deepest = matches[matches.length - 1];
        if (deepest) {
          const dom = resolveOwnerDom(deepest.owner);
          if (dom instanceof Node) {
            innermostElement = dom;
          }
        }
      }
    } catch {
      // Tracked owner query may fail
    }
  }

  // Strategy 3: try element-based owner lookup (for DevTools etc.)
  if (components.length === 0) {
    try {
      let owner = getOwnerFromElement(element);
      let depth = 0;

      while (
        owner &&
        depth < resolved.maxDepth &&
        components.length < resolved.maxComponents
      ) {
        const name = getNameFromOwner(owner);

        if (
          name &&
          !isMinifiedName(name) &&
          shouldIncludeComponent(name, depth, resolved, domClasses)
        ) {
          components.push(name);
          const dom = resolveOwnerDom(owner);
          if (dom instanceof Node) {
            innermostElement = dom;
          }
        }

        owner = getParentOwner(owner);
        depth++;
      }
    } catch {
      // Element-based lookup may fail
    }
  }

  if (components.length === 0) {
    const result: SolidComponentInfo = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result);
    }
    return result;
  }

  // Build path: outermost → innermost: <App> <Layout> <Button>
  const path = components.map((c) => `<${c}>`).join(" ");

  const result: SolidComponentInfo = { path, components, innermostElement };
  if (useCache) {
    componentCacheAll.set(element, result);
  }
  return result;
}
