// =============================================================================
// Solid Component Name Detection
// Uses Solid's dev-mode owner tree to extract component names from DOM elements
// =============================================================================

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
]);

/**
 * Default patterns for framework internals
 * Note: Patterns are designed to be specific to avoid false positives
 * (e.g., ServerStatus, ClientProfile should NOT be filtered)
 */
export const DEFAULT_SKIP_PATTERNS: RegExp[] = [
  /Boundary$/, // ErrorBoundary, RedirectBoundary
  /BoundaryHandler$/, // ErrorBoundaryHandler
  /Provider$/, // ThemeProvider, Context.Provider
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
  /^Root$/, // Generic Root component
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
 * Solid's internal owner structure (dev mode only).
 * In development builds, Solid attaches reactive ownership info to track
 * component hierarchies. The exact shape varies between Solid versions.
 */
interface SolidOwner {
  name?: string;
  componentName?: string;
  owner?: SolidOwner | null;
  // Some versions use "parent" instead of "owner"
  parent?: SolidOwner | null;
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
 * Check if an element has Solid-specific owner keys.
 * In dev mode, Solid attaches ownership properties to DOM nodes.
 */
function hasSolidOwner(element: Element): boolean {
  try {
    const keys = Object.keys(element);
    // Check for known Solid internal property patterns
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

    // Check Symbol properties as well (Solid may use symbols)
    const symbols = Object.getOwnPropertySymbols(element);
    if (
      symbols.some((sym) => {
        const desc = sym.description || String(sym);
        return (
          desc.includes("solid") ||
          desc.includes("owner") ||
          desc.includes("SOLID")
        );
      })
    ) {
      return true;
    }
  } catch {
    // Property access may fail in edge cases
  }

  return false;
}

/**
 * Checks if Solid is present on the page.
 * Scans common root containers since Solid typically mounts
 * to #root, #app, etc.
 */
export function isSolidPage(): boolean {
  if (solidDetectionCache !== null) {
    return solidDetectionCache;
  }

  if (typeof document === "undefined") {
    return false;
  }

  // Check body first (some apps mount directly to body)
  if (document.body && hasSolidOwner(document.body)) {
    solidDetectionCache = true;
    return true;
  }

  // Check common root containers
  const commonRoots = ["#root", "#app", "[data-solid-root]"];
  for (const selector of commonRoots) {
    const el = document.querySelector(selector);
    if (el && hasSolidOwner(el)) {
      solidDetectionCache = true;
      return true;
    }
  }

  // Scan immediate children of body as fallback
  if (document.body) {
    for (const child of document.body.children) {
      if (hasSolidOwner(child)) {
        solidDetectionCache = true;
        return true;
      }
    }
  }

  // Check for Solid-specific globals that indicate a Solid app
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

  solidDetectionCache = false;
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

/**
 * Attempt to extract the Solid owner from a DOM element.
 * Tries multiple known property patterns across Solid versions.
 */
function getOwnerFromElement(element: HTMLElement): SolidOwner | null {
  try {
    const record = element as unknown as Record<string | symbol, unknown>;

    // Approach 1: Check for __$owner (common in Solid dev mode)
    if (record.__$owner && typeof record.__$owner === "object") {
      return record.__$owner as SolidOwner;
    }

    // Approach 2: Check string keys matching Solid patterns
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
          // Verify it looks like an owner (has name or owner/parent chain)
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

    // Approach 3: Check Symbol properties
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
  // Prefer componentName if set explicitly
  if (owner.componentName && typeof owner.componentName === "string") {
    return owner.componentName;
  }

  // Fall back to name property
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
  /** Array of component names from innermost to outermost */
  components: string[];
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
 * Walks up the owner tree to collect Solid component names
 *
 * @param element - The DOM element to start from
 * @param config - Optional configuration
 * @returns SolidComponentInfo with component path and array
 */
export function getSolidComponentName(
  element: HTMLElement,
  config?: SolidDetectionConfig,
): SolidComponentInfo {
  const resolved = resolveConfig(config);

  // Only use cache for 'all' mode - filtered modes must NOT cache because:
  // - Cache lookup happens BEFORE filtering logic runs
  // - Cached results from before filter updates would bypass new filters
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

  // Collect DOM classes for smart mode
  const domClasses =
    resolved.mode === "smart" ? getAncestorClasses(element) : undefined;

  const components: string[] = [];

  try {
    let owner = getOwnerFromElement(element);
    let depth = 0;

    while (
      owner &&
      depth < resolved.maxDepth &&
      components.length < resolved.maxComponents
    ) {
      const name = getNameFromOwner(owner);

      // Skip minified names and apply filter
      if (
        name &&
        !isMinifiedName(name) &&
        shouldIncludeComponent(name, depth, resolved, domClasses)
      ) {
        components.push(name);
      }

      owner = getParentOwner(owner);
      depth++;
    }
  } catch {
    // Owner structure may be corrupted or inaccessible - return empty result
    const result: SolidComponentInfo = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result);
    }
    return result;
  }

  if (components.length === 0) {
    const result: SolidComponentInfo = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result);
    }
    return result;
  }

  // Build path from outermost to innermost: <App> <Layout> <Button>
  const path = components
    .slice()
    .reverse()
    .map((c) => `<${c}>`)
    .join(" ");

  const result: SolidComponentInfo = { path, components };
  if (useCache) {
    componentCacheAll.set(element, result);
  }
  return result;
}
