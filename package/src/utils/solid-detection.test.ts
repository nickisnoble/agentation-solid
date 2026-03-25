/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock solid-js before any imports that use it
vi.mock("solid-js", () => ({
  DEV: { hooks: {} },
}));

import {
  getSolidComponentName,
  isSolidPage,
  clearSolidDetectionCache,
  setRootOwner,
  initOwnerTracking,
  DEFAULT_SKIP_EXACT,
  DEFAULT_SKIP_PATTERNS,
} from "./solid-detection";

// =============================================================================
// Mock Owner Helpers
// =============================================================================

type MockOwner = {
  name?: string;
  componentName?: string;
  component?: Function | boolean;
  value?: unknown;
  tValue?: unknown;
  owner?: MockOwner | null;
  parent?: MockOwner | null;
  owned?: MockOwner[] | null;
};

/**
 * Create a mock Solid owner node
 */
function createMockOwner(
  name: string,
  domNode?: Node,
  options: { children?: MockOwner[]; component?: boolean } = {},
): MockOwner {
  const owner: MockOwner = {
    name,
    component: options.component !== false ? (() => {}) : undefined,
    value: domNode || null,
    owned: options.children || null,
    owner: null,
  };
  // Wire up parent references for children
  if (options.children) {
    for (const child of options.children) {
      child.owner = owner;
    }
  }
  return owner;
}

/**
 * Create a DOM element and append it to a parent
 */
function createElement(
  parent: Node,
  options: { className?: string; tag?: string } = {},
): HTMLElement {
  const el = document.createElement(options.tag || "div");
  if (options.className) {
    el.className = options.className;
  }
  parent.appendChild(el);
  return el;
}

// =============================================================================
// Tests
// =============================================================================

describe("solid-detection", () => {
  beforeEach(() => {
    clearSolidDetectionCache();
    document.body.innerHTML = "";
    // Clean up globals
    delete (globalThis as Record<string, unknown>).Solid$$;
    delete (window as unknown as Record<string, unknown>).__SOLID_DEVTOOLS_GLOBAL_HOOK__;
  });

  // ===========================================================================
  // clearSolidDetectionCache — MUST run before any setRootOwner() calls
  // since rootOwner is module-level state that clearSolidDetectionCache
  // does not reset.
  // ===========================================================================

  describe("clearSolidDetectionCache", () => {
    it("resets the detection cache", () => {
      (globalThis as Record<string, unknown>).Solid$$ = true;
      expect(isSolidPage()).toBe(true);
      delete (globalThis as Record<string, unknown>).Solid$$;
      // Without clearing cache, should still return true (cached)
      expect(isSolidPage()).toBe(true);
      clearSolidDetectionCache();
      // After clearing cache, re-evaluation finds no markers → false
      expect(isSolidPage()).toBe(false);
    });
  });

  // ===========================================================================
  // isSolidPage
  // ===========================================================================

  describe("isSolidPage", () => {
    it("returns false for non-Solid pages", () => {
      expect(isSolidPage()).toBe(false);
    });

    it("returns true when rootOwner is set", () => {
      setRootOwner({ name: "Root" });
      expect(isSolidPage()).toBe(true);
    });

    it("returns true when Solid$$ global exists", () => {
      (globalThis as Record<string, unknown>).Solid$$ = true;
      expect(isSolidPage()).toBe(true);
    });

    it("returns true when __SOLID_DEVTOOLS_GLOBAL_HOOK__ exists", () => {
      (window as unknown as Record<string, unknown>).__SOLID_DEVTOOLS_GLOBAL_HOOK__ = {};
      expect(isSolidPage()).toBe(true);
    });

    it("returns true when DOM elements have __$owner property", () => {
      const child = document.createElement("div");
      (child as unknown as Record<string, unknown>).__$owner = { name: "App" };
      document.body.appendChild(child);
      expect(isSolidPage()).toBe(true);
    });

    it("returns true when DOM elements have __solid keys", () => {
      const child = document.createElement("div");
      (child as unknown as Record<string, unknown>).__solidOwner = { name: "App" };
      document.body.appendChild(child);
      expect(isSolidPage()).toBe(true);
    });

    it("caches the result", () => {
      setRootOwner({ name: "Root" });
      expect(isSolidPage()).toBe(true);
      // Cache should persist across calls
      expect(isSolidPage()).toBe(true);
    });
  });

  // ===========================================================================
  // getSolidComponentName
  // ===========================================================================

  describe("getSolidComponentName", () => {
    it("returns empty result for non-Solid elements", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);
      const result = getSolidComponentName(element);
      expect(result.path).toBeNull();
      expect(result.components).toEqual([]);
    });

    it("extracts single component name from owner tree", () => {
      const buttonEl = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("Button", buttonEl),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(buttonEl);
      expect(result.components).toContain("Button");
      expect(result.path).toContain("<Button>");
    });

    it("extracts component hierarchy", () => {
      const container = createElement(document.body);
      const buttonEl = createElement(container);

      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("Layout", container, {
            children: [
              createMockOwner("Button", buttonEl),
            ],
          }),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(buttonEl, { mode: "all" });
      expect(result.components).toContain("App");
      expect(result.components).toContain("Layout");
      expect(result.components).toContain("Button");
      // Path should be outermost to innermost
      expect(result.path).toBe("<App> <Layout> <Button>");
    });

    it("respects maxComponents config", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("C1", document.body, {
        children: [
          createMockOwner("C2", document.body, {
            children: [
              createMockOwner("C3", document.body, {
                children: [
                  createMockOwner("C4", el),
                ],
              }),
            ],
          }),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, {
        mode: "all",
        maxComponents: 2,
      });
      expect(result.components.length).toBeLessThanOrEqual(2);
    });

    it("caches results per element in 'all' mode", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("CachedComponent", el);
      setRootOwner(tree);

      const result1 = getSolidComponentName(el, { mode: "all" });
      const result2 = getSolidComponentName(el, { mode: "all" });
      expect(result1).toBe(result2); // Same reference = cached
    });
  });

  // ===========================================================================
  // Filter Modes
  // ===========================================================================

  describe("filter modes", () => {
    it("mode: filtered skips DEFAULT_SKIP_EXACT names", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("Show", document.body, {
            children: [
              createMockOwner("Button", el),
            ],
          }),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "filtered" });
      expect(result.components).not.toContain("Show");
      expect(result.components).toContain("Button");
    });

    it("mode: filtered skips Provider patterns", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("ThemeProvider", document.body, {
            children: [
              createMockOwner("Button", el),
            ],
          }),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "filtered" });
      expect(result.components).not.toContain("ThemeProvider");
    });

    it("mode: all includes more components", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("Show", document.body, {
            children: [
              createMockOwner("Layout", el),
            ],
          }),
        ],
      });
      setRootOwner(tree);

      const allResult = getSolidComponentName(el, { mode: "all" });
      clearSolidDetectionCache();
      setRootOwner(tree);
      const filteredResult = getSolidComponentName(el, { mode: "filtered" });

      // All mode should include at least as many components
      expect(allResult.components.length).toBeGreaterThanOrEqual(
        filteredResult.components.length,
      );
    });
  });

  // ===========================================================================
  // DEFAULT_SKIP_EXACT
  // ===========================================================================

  describe("DEFAULT_SKIP_EXACT", () => {
    it("includes Solid control flow components", () => {
      expect(DEFAULT_SKIP_EXACT.has("Show")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("For")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Index")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Switch")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Match")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Dynamic")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Portal")).toBe(true);
    });

    it("includes framework internals", () => {
      expect(DEFAULT_SKIP_EXACT.has("Fragment")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Suspense")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Root")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("ErrorBoundary")).toBe(true);
    });

    it("includes routing internals", () => {
      expect(DEFAULT_SKIP_EXACT.has("MatchesInner")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Matches")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("CatchBoundary")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("RouterProvider")).toBe(true);
    });
  });

  // ===========================================================================
  // DEFAULT_SKIP_PATTERNS
  // ===========================================================================

  describe("DEFAULT_SKIP_PATTERNS", () => {
    it("matches Boundary patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ErrorBoundary"));
      expect(matches).toBe(true);
    });

    it("matches Provider patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ThemeProvider"));
      expect(matches).toBe(true);
    });

    it("matches Router patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("BrowserRouter"));
      expect(matches).toBe(true);
    });

    it("matches Handler patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ScrollAndFocusHandler"));
      expect(matches).toBe(true);
    });

    it("does not match user components", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("UserProfile"));
      expect(matches).toBe(false);
    });

    it("does not match ServerStatus (avoid false positives)", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ServerStatus"));
      expect(matches).toBe(false);
    });

    it("does not match ClientProfile (avoid false positives)", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ClientProfile"));
      expect(matches).toBe(false);
    });
  });

  // ===========================================================================
  // Smart Mode
  // ===========================================================================

  describe("smart mode", () => {
    it("includes components that match CSS classes", () => {
      const el = createElement(document.body, { className: "side-nav" });
      const tree = createMockOwner("SideNav", el);
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "smart" });
      expect(result.components).toContain("SideNav");
    });

    it("includes components matching user patterns (e.g., Page suffix)", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("HomePage", el);
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "smart" });
      expect(result.components).toContain("HomePage");
    });

    it("excludes components that do not correlate with DOM", () => {
      const el = createElement(document.body, { className: "btn" });
      const tree = createMockOwner("InternalWrapper", document.body, {
        children: [
          createMockOwner("SubmitButton", el),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "smart" });
      // SubmitButton matches user pattern (Button$), InternalWrapper does not
      expect(result.components).toContain("SubmitButton");
      expect(result.components).not.toContain("InternalWrapper");
    });

    it("matches partial class names", () => {
      const el = createElement(document.body, { className: "main-navigation" });
      const tree = createMockOwner("NavigationMenu", el);
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "smart" });
      expect(result.components).toContain("NavigationMenu");
    });
  });

  // ===========================================================================
  // Minified Name Filtering
  // ===========================================================================

  describe("minified name filtering", () => {
    it("filters single letter names", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("e", el),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "all" });
      expect(result.components).not.toContain("e");
      expect(result.components).toContain("App");
    });

    it("filters two letter names", () => {
      const el = createElement(document.body);
      const tree = createMockOwner("App", document.body, {
        children: [
          createMockOwner("Zt", el),
        ],
      });
      setRootOwner(tree);

      const result = getSolidComponentName(el, { mode: "all" });
      expect(result.components).not.toContain("Zt");
    });
  });

  // ===========================================================================
  // Cache Behavior with Different Modes
  // ===========================================================================

  describe("cache behavior with different modes", () => {
    it("caches separately per mode (all caches, filtered does not)", () => {
      const el = createElement(document.body, { className: "product-card" });
      const tree = createMockOwner("HelperUtil", document.body, {
        children: [
          createMockOwner("ProductCard", el),
        ],
      });
      setRootOwner(tree);

      // Filtered mode: should include both (neither in skip lists)
      const filteredResult = getSolidComponentName(el, { mode: "filtered" });
      // Smart mode: ProductCard matches DOM class, HelperUtil does not
      const smartResult = getSolidComponentName(el, { mode: "smart" });

      expect(filteredResult.components).toContain("ProductCard");
      expect(smartResult.components).toContain("ProductCard");

      // HelperUtil: filtered includes it, smart does not (no DOM correlation or user pattern)
      expect(filteredResult.components).toContain("HelperUtil");
      expect(smartResult.components).not.toContain("HelperUtil");
    });
  });

  // ===========================================================================
  // Strategy 3: Element-Based Owner Lookup
  // ===========================================================================

  describe("element-based owner lookup", () => {
    // These tests use detached elements (not in document.body) so that
    // any leaked rootOwner from prior tests won't match via Strategy 1.

    it("finds components from __$owner property on elements", () => {
      // This tests Strategy 3 — when rootOwner tree walk finds nothing,
      // fall back to checking __$owner directly on the element
      (globalThis as Record<string, unknown>).Solid$$ = true; // Make isSolidPage() true
      const container = document.createElement("div");
      const el = document.createElement("div");
      container.appendChild(el);
      (el as unknown as Record<string, unknown>).__$owner = {
        name: "DirectOwner",
        componentName: "DirectOwner",
        owner: null,
      };

      const result = getSolidComponentName(el, { mode: "all" });
      expect(result.components).toContain("DirectOwner");
    });

    it("walks parent chain via owner.owner", () => {
      (globalThis as Record<string, unknown>).Solid$$ = true;
      const container = document.createElement("div");
      const el = document.createElement("div");
      container.appendChild(el);
      const grandparent = { name: "App", componentName: "App", owner: null as MockOwner | null };
      const parent = { name: "Layout", componentName: "Layout", owner: grandparent };
      const child = { name: "Button", componentName: "Button", owner: parent };
      (el as unknown as Record<string, unknown>).__$owner = child;

      const result = getSolidComponentName(el, { mode: "all" });
      expect(result.components).toContain("Button");
      expect(result.components).toContain("Layout");
      expect(result.components).toContain("App");
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe("error handling", () => {
    it("returns empty result for elements with no owner", () => {
      setRootOwner({ name: "Root" }); // Make isSolidPage() true
      const element = document.createElement("div");
      document.body.appendChild(element);

      const result = getSolidComponentName(element);
      expect(result.path).toBeNull();
      expect(result.components).toEqual([]);
    });

    it("handles corrupted owner on element gracefully", () => {
      (globalThis as Record<string, unknown>).Solid$$ = true;
      const element = document.createElement("div");
      Object.defineProperty(element, "__$owner", {
        get() {
          throw new Error("Corrupted owner");
        },
        configurable: true,
      });
      document.body.appendChild(element);

      const result = getSolidComponentName(element);
      expect(result.path).toBeNull();
      expect(result.components).toEqual([]);
    });
  });
});
